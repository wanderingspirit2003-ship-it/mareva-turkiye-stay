type SearchApiPrice = {
  extracted_price?: number;
  extracted_price_before_taxes?: number;
};

type SearchApiOffer = {
  source?: string;
  link?: string;
  tracking_link?: string;
  is_official?: boolean;
  has_free_cancellation?: boolean;
  remarks?: string[];
  total_price?: SearchApiPrice;
  price_per_night?: SearchApiPrice;
};

type SearchApiProperty = {
  property_token?: string;
  type?: string;
  name?: string;
  link?: string;
  description?: string;
  address?: string;
  city?: string;
  country?: string;
  extracted_hotel_class?: number;
  rating?: number;
  reviews?: number;
  deal?: string;
  deal_description?: string;
  price_per_night?: SearchApiPrice;
  total_price?: SearchApiPrice;
  images?: Array<{ thumbnail?: string; original?: string }>;
  amenities?: string[];
  essential_info?: string[];
  featured_offers?: SearchApiOffer[];
  all_offers?: SearchApiOffer[];
};

type SearchApiResponse = {
  properties?: SearchApiProperty[];
  property?: SearchApiProperty;
  pagination?: { next_page_token?: string };
};

const turkeySearchScopes = [
  ["Анталья", "Antalya"], ["Аланья", "Alanya"], ["Белек", "Belek"], ["Сиде", "Side"],
  ["Кемер", "Kemer"], ["Бодрум", "Bodrum"], ["Мармарис", "Marmaris"], ["Фетхие", "Fethiye"],
  ["Олюдениз", "Oludeniz"], ["Каш", "Kas"], ["Кушадасы", "Kusadasi"], ["Чешме", "Cesme"],
  ["Дидим", "Didim"], ["Даламан", "Dalaman"], ["Сарыгерме", "Sarigerme"], ["Измир", "Izmir"],
  ["Стамбул", "Istanbul"], ["Каппадокия", "Cappadocia"],
] as const;

const destinationQueries = Object.fromEntries(turkeySearchScopes) as Record<string, string>;

function totalOf(value: { total_price?: SearchApiPrice; price_per_night?: SearchApiPrice }, nights: number) {
  const total = value.total_price?.extracted_price ?? value.total_price?.extracted_price_before_taxes;
  if (typeof total === "number") return total;
  const nightly = value.price_per_night?.extracted_price ?? value.price_per_night?.extracted_price_before_taxes;
  return typeof nightly === "number" ? nightly * nights : null;
}

function discountOf(deal?: string) {
  const match = deal?.match(/(\d{1,2})\s*%/);
  return match ? Number(match[1]) : 0;
}

function roomSizeOf(info?: string[]) {
  const text = info?.join(" ") || "";
  const metric = text.match(/(\d+(?:[.,]\d+)?)\s*(?:m²|m2|sq\.?\s*m)/i);
  if (metric) return Math.round(Number(metric[1].replace(",", ".")));
  const imperial = text.match(/(\d+(?:[.,]\d+)?)\s*(?:sq\.?\s*ft|ft²)/i);
  return imperial ? Math.round(Number(imperial[1].replace(",", ".")) * 0.092903) : null;
}

async function searchApiRequest(params: URLSearchParams, apiKey: string) {
  const response = await fetch(`https://www.searchapi.io/api/v1/search?${params.toString()}`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
  });
  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`SearchAPI returned ${response.status}${body ? `: ${body.slice(0, 180)}` : ""}`);
  }
  return response.json() as Promise<SearchApiResponse>;
}

export async function GET(request: Request) {
  const apiKey = process.env.SEARCHAPI_KEY;
  if (!apiKey) {
    return Response.json({ error: "SOURCE_NOT_CONFIGURED", message: "Live hotel source is not configured." }, { status: 503 });
  }

  const url = new URL(request.url);
  const destination = url.searchParams.get("destination") || "Turkey";
  const hotelName = (url.searchParams.get("hotelName") || "").trim().slice(0, 120);
  const pageToken = (url.searchParams.get("pageToken") || "").trim().slice(0, 500);
  const requestedScopeIndex = Number(url.searchParams.get("scopeIndex") || 0);
  const requestedOffset = Number(url.searchParams.get("offset") || 0);
  const offset = Number.isInteger(requestedOffset) ? Math.max(0, Math.min(100, requestedOffset)) : 0;
  const checkIn = url.searchParams.get("checkIn") || "";
  const checkOut = url.searchParams.get("checkOut") || "";
  const adults = Math.max(1, Math.min(10, Number(url.searchParams.get("guests") || 2)));
  const requestedMaxNightlyPrice = Number(url.searchParams.get("maxPrice") || 10000);
  const maxNightlyPrice = Number.isFinite(requestedMaxNightlyPrice)
    ? Math.max(400, Math.min(10000, requestedMaxNightlyPrice))
    : 10000;
  const language = ["ru", "en", "tr"].includes(url.searchParams.get("language") || "") ? url.searchParams.get("language")! : "ru";
  const start = new Date(`${checkIn}T00:00:00Z`);
  const end = new Date(`${checkOut}T00:00:00Z`);
  const nights = Math.round((end.getTime() - start.getTime()) / 86400000);
  if (!checkIn || !checkOut || !Number.isFinite(nights) || nights < 1 || nights > 30) {
    return Response.json({ error: "INVALID_DATES", message: "Choose a stay from 1 to 30 nights." }, { status: 400 });
  }

  const scopes = destination === "Вся Турция" && !hotelName
    ? turkeySearchScopes.map(([label, queryName]) => ({ label, queryName }))
    : [{ label: destination, queryName: destination === "Вся Турция" ? "Turkey" : destinationQueries[destination] || destination }];
  const scopeIndex = Number.isInteger(requestedScopeIndex)
    ? Math.max(0, Math.min(scopes.length - 1, requestedScopeIndex))
    : 0;
  const activeScope = scopes[scopeIndex];
  const locationQuery = activeScope.queryName === "Turkey" ? "Turkey" : `${activeScope.queryName}, Turkey`;
  const query = hotelName ? `${hotelName}, ${locationQuery}` : `Hotels in ${locationQuery}`;
  const propertyType = adults > 6 ? "vacation_rental" : "hotel";
  const searchParams = new URLSearchParams({
    engine: "google_hotels",
    q: query,
    check_in_date: checkIn,
    check_out_date: checkOut,
    adults: String(adults),
    currency: "EUR",
    gl: "tr",
    hl: language,
    property_type: propertyType,
    sort_by: "lowest_price",
    price_max: String(maxNightlyPrice),
  });
  if (propertyType === "hotel") searchParams.set("special_offers", "true");
  if (pageToken) searchParams.set("next_page_token", pageToken);

  try {
    const search = await searchApiRequest(searchParams, apiKey);
    const discountedProperties = (search.properties || [])
      .filter((property) => property.property_token && discountOf(property.deal) > 0);
    const properties = discountedProperties.slice(offset, offset + 8);
    const nextCursor = offset + properties.length < discountedProperties.length
      ? { scopeIndex, pageToken, offset: offset + properties.length }
      : search.pagination?.next_page_token
        ? { scopeIndex, pageToken: search.pagination.next_page_token, offset: 0 }
        : scopeIndex + 1 < scopes.length
          ? { scopeIndex: scopeIndex + 1, pageToken: "", offset: 0 }
          : null;
    const checkedAt = new Date().toISOString();
    // The hotel list already contains prices, deal labels, links and galleries.
    // Keeping one upstream call per portion preserves the SearchAPI allowance.
    const details = properties;

    const offers = details.flatMap((property, index) => {
      const priced = [...(property.featured_offers || []), ...(property.all_offers || [])]
        .map((offer) => ({ offer, total: totalOf(offer, nights) }))
        .filter((item): item is { offer: SearchApiOffer; total: number } => item.total !== null);
      const official = priced.filter(({ offer }) => offer.is_official).sort((a, b) => a.total - b.total)[0];
      const bookable = priced
        .filter(({ offer }) => !offer.is_official && (offer.link || offer.tracking_link))
        .sort((a, b) => a.total - b.total)[0];
      const statedDiscount = discountOf(property.deal);
      const current = bookable?.total ?? totalOf(property, nights);
      if (current === null || current / nights > maxNightlyPrice) return [];

      const exactDiscount = official && current < official.total
        ? Math.round((1 - current / official.total) * 100)
        : 0;
      const discount = exactDiscount || statedDiscount;
      if (discount < 1) return [];
      const usualTotal = exactDiscount
        ? official!.total
        : Math.round(current / (1 - Math.min(discount, 90) / 100));
      if (usualTotal <= current) return [];

      const images = Array.from(new Set((property.images || [])
        .map((item) => item.original || item.thumbnail || "")
        .filter(Boolean)))
        .slice(0, 12);
      const image = images[0] || "";
      const descriptor = `${property.name || ""} ${property.description || ""}`.toLowerCase();
      const isRental = property.type?.toLowerCase().includes("vacation");
      const stayType = /apart|apartment|residence|suite|daire/.test(descriptor)
        ? "Апарт-отель"
        : isRental || /villa|bungalow|cottage/.test(descriptor)
          ? "Вилла"
          : "Отель";
      const bookingSource = bookable?.offer.source || property.deal_description || "Google Hotels";
      const bookingLink = bookable?.offer.link || bookable?.offer.tracking_link || property.link;
      if (!bookingLink) return [];

      return [{
        id: property.property_token || `live-${index}`,
        name: property.name || "Hotel",
        city: destination !== "Вся Турция" ? destination : activeScope.label,
        area: property.address || [property.city, property.country].filter(Boolean).join(", ") || destination,
        type: stayType,
        stars: property.extracted_hotel_class || 0,
        score: property.rating ? Math.min(10, Math.round(property.rating * 20) / 10) : 0,
        reviews: property.reviews || 0,
        roomSize: roomSizeOf(property.essential_info),
        guests: adults,
        price: Math.round(current),
        oldPrice: Math.round(usualTotal),
        image,
        images,
        tags: [
          bookingSource,
          bookable?.offer.has_free_cancellation ? "Бесплатная отмена" : property.deal_description || property.deal || "Спецпредложение",
          ...(property.amenities || []).slice(0, 4),
        ],
        feature: bookingSource,
        distance: property.description || property.address || destination,
        link: bookingLink,
        officialSource: official?.offer.source || "обычная цена Google Hotels",
        discount,
        checkedAt,
        live: true,
      }];
    }).sort((a, b) => b.discount - a.discount || a.price - b.price);

    return Response.json({ offers, checkedAt, searched: properties.length, nextCursor, searchedScope: activeScope.label, source: "Google Hotels via SearchAPI.io" }, {
      headers: { "Cache-Control": "private, max-age=900" },
    });
  } catch (error) {
    return Response.json({ error: "SOURCE_ERROR", message: error instanceof Error ? error.message : "Live search failed." }, { status: 502 });
  }
}
