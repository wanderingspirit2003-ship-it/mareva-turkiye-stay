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

type PropertyType = "Отель" | "Апарт-отель" | "Вилла";

const turkeySearchScopes = [
  ["Анталья", "Antalya"], ["Аланья", "Alanya"], ["Белек", "Belek"], ["Сиде", "Side"],
  ["Кемер", "Kemer"], ["Бодрум", "Bodrum"], ["Мармарис", "Marmaris"], ["Фетхие", "Fethiye"],
  ["Олюдениз", "Oludeniz"], ["Каш", "Kas"], ["Кушадасы", "Kusadasi"], ["Чешме", "Cesme"],
  ["Дидим", "Didim"], ["Даламан", "Dalaman"], ["Сарыгерме", "Sarigerme"], ["Измир", "Izmir"],
  ["Стамбул", "Istanbul"], ["Каппадокия", "Cappadocia"],
] as const;

const destinationQueries = Object.fromEntries(turkeySearchScopes) as Record<string, string>;
const locationNameTokens = new Set(turkeySearchScopes.flatMap(([label, queryName]) => [
  normalizeSearchToken(label),
  normalizeSearchToken(queryName),
  ...normalizeSearchToken(label).split(" "),
  ...normalizeSearchToken(queryName).split(" "),
]).filter(Boolean));

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

function propertyKey(property: SearchApiProperty) {
  return property.property_token || property.link || `${property.name || ""}-${property.address || ""}-${property.city || ""}`;
}

function mergeProperties(...groups: SearchApiProperty[][]) {
  const seen = new Set<string>();
  return groups.flatMap((group) => group.filter((property) => {
    const key = propertyKey(property);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  }));
}

function normalizeSearchToken(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ı/g, "i")
    .replace(/[^a-z0-9а-яё]+/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeHotelName(value: string) {
  return normalizeSearchToken(value)
    .replace(/\b(?:hotel|hotels|otel|отель|отели|the)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function distinctiveHotelTokens(query: string) {
  const tokens = normalizeHotelName(query).split(" ").filter((token) => token.length > 1);
  const distinctive = tokens.filter((token) => !locationNameTokens.has(token) && token !== "turkey" && token !== "turkiye");
  return distinctive.length > 0 ? distinctive : tokens;
}

function hotelNameScore(propertyName: string | undefined, query: string) {
  const normalizedQuery = normalizeHotelName(query);
  if (!normalizedQuery) return 0;
  const normalizedName = normalizeHotelName(propertyName || "");
  if (!normalizedName) return 0;
  if (normalizedName === normalizedQuery) return 1000;
  if (normalizedName.includes(normalizedQuery)) return 700 + normalizedQuery.length;
  if (normalizedQuery.includes(normalizedName)) return 500 + normalizedName.length;
  const queryTokens = distinctiveHotelTokens(query);
  if (queryTokens.length === 0) return 0;
  const matchedTokens = queryTokens.filter((token) => normalizedName.includes(token));
  if (matchedTokens.length === 0) return 0;
  const coverage = matchedTokens.length / queryTokens.length;
  return Math.round(coverage * 300) + matchedTokens.join("").length;
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
  const rooms = Math.max(1, Math.min(8, Number(url.searchParams.get("rooms") || 1)));
  const propertyTypes = (url.searchParams.get("propertyTypes") || "")
    .split(",")
    .filter((item): item is PropertyType => item === "Отель" || item === "Апарт-отель" || item === "Вилла");
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

  const isWideTurkeySearch = destination === "Вся Турция" && !hotelName;
  const scopes = isWideTurkeySearch
    ? turkeySearchScopes.map(([label, queryName]) => ({ label, queryName }))
    : [{ label: destination, queryName: destination === "Вся Турция" ? "Turkey" : destinationQueries[destination] || destination }];
  const scopeIndex = Number.isInteger(requestedScopeIndex)
    ? Math.max(0, Math.min(scopes.length - 1, requestedScopeIndex))
    : 0;
  const activeScope = scopes[scopeIndex];
  const locationQuery = activeScope.queryName === "Turkey" ? "Turkey" : `${activeScope.queryName}, Turkey`;
  const query = hotelName ? `${hotelName}, ${locationQuery}` : `Hotels in ${locationQuery}`;
  const searchParams = new URLSearchParams({
    engine: "google_hotels",
    q: query,
    check_in_date: checkIn,
    check_out_date: checkOut,
    adults: String(adults),
    rooms: String(rooms),
    currency: "EUR",
    gl: "tr",
    hl: language,
    sort_by: "lowest_price",
    price_max: String(maxNightlyPrice),
  });
  if (propertyTypes.length === 1) {
    searchParams.set("property_type", propertyTypes[0] === "Отель" ? "hotel" : "vacation_rental");
  } else if (propertyTypes.length === 0 && adults > 6) {
    searchParams.set("property_type", "vacation_rental");
  }
  if (pageToken) searchParams.set("next_page_token", pageToken);

  try {
    const generalSearch = await searchApiRequest(searchParams, apiKey);
    let specialSearch: SearchApiResponse | null = null;
    if (!pageToken) {
      const specialParams = new URLSearchParams(searchParams);
      specialParams.set("special_offers", "true");
      specialSearch = await searchApiRequest(specialParams, apiKey).catch(() => null);
    }
    const directProperties = generalSearch.property ? [generalSearch.property] : [];
    const mergedProperties = specialSearch
      ? mergeProperties(directProperties, specialSearch.properties || [], generalSearch.properties || [])
      : mergeProperties(directProperties, generalSearch.properties || []);
    const searchableProperties = mergedProperties
      .filter((property) => property.property_token || property.link || property.name);
    const rankedProperties = hotelName
      ? [...searchableProperties].sort((a, b) => {
        const scoreDelta = hotelNameScore(b.name, hotelName) - hotelNameScore(a.name, hotelName);
        if (scoreDelta !== 0) return scoreDelta;
        return discountOf(b.deal) - discountOf(a.deal);
      })
      : searchableProperties;
    const properties = rankedProperties.slice(offset, offset + 18);
    const nextCursor = isWideTurkeySearch
      ? scopeIndex + 1 < scopes.length
        ? { scopeIndex: scopeIndex + 1, pageToken: "", offset: 0 }
        : null
      : offset + properties.length < rankedProperties.length
        ? { scopeIndex, pageToken, offset: offset + properties.length }
        : generalSearch.pagination?.next_page_token
          ? { scopeIndex, pageToken: generalSearch.pagination.next_page_token, offset: 0 }
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
      const usualTotal = exactDiscount
        ? official!.total
        : discount > 0
          ? Math.round(current / (1 - Math.min(discount, 90) / 100))
          : current;
      if (discount > 0 && usualTotal <= current) return [];

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
      if (propertyTypes.length > 0 && !propertyTypes.includes(stayType)) return [];
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
        guests: Math.max(adults, Math.ceil(adults / rooms)),
        price: Math.round(current),
        oldPrice: Math.round(usualTotal),
        image,
        images,
        tags: [
          bookingSource,
          bookable?.offer.has_free_cancellation
            ? "Бесплатная отмена"
            : property.deal_description || property.deal || (discount > 0 ? "Спецпредложение" : "Обычный вариант"),
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
    }).sort((a, b) => {
      const scoreDelta = hotelName ? hotelNameScore(b.name, hotelName) - hotelNameScore(a.name, hotelName) : 0;
      return scoreDelta || (b.discount || 0) - (a.discount || 0) || a.price - b.price;
    });

    return Response.json({ offers, checkedAt, searched: properties.length, nextCursor, searchedScope: activeScope.label, source: "Google Hotels via SearchAPI.io" }, {
      headers: { "Cache-Control": "private, max-age=900" },
    });
  } catch (error) {
    return Response.json({ error: "SOURCE_ERROR", message: error instanceof Error ? error.message : "Live search failed." }, { status: 502 });
  }
}
