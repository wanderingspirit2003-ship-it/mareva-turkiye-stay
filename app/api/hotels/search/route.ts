type SerpRate = {
  lowest?: string;
  extracted_lowest?: number;
};

type SerpPrice = {
  source?: string;
  link?: string;
  official?: boolean;
  free_cancellation?: boolean;
  total_rate?: SerpRate;
  rate_per_night?: SerpRate;
};

type SerpProperty = {
  property_token?: string;
  type?: string;
  name?: string;
  address?: string;
  extracted_hotel_class?: number;
  overall_rating?: number;
  reviews?: number;
  images?: Array<{ thumbnail?: string; original_image?: string }>;
  prices?: SerpPrice[];
  featured_prices?: SerpPrice[];
};

function totalOf(price: SerpPrice, nights: number) {
  const total = price.total_rate?.extracted_lowest;
  if (typeof total === "number") return total;
  const nightly = price.rate_per_night?.extracted_lowest;
  return typeof nightly === "number" ? nightly * nights : null;
}

async function serpRequest(params: URLSearchParams) {
  const response = await fetch(`https://serpapi.com/search.json?${params.toString()}`, {
    headers: { Accept: "application/json" },
  });
  if (!response.ok) throw new Error(`SerpApi returned ${response.status}`);
  return response.json() as Promise<Record<string, unknown>>;
}

export async function GET(request: Request) {
  const apiKey = process.env.SERPAPI_KEY;
  if (!apiKey) {
    return Response.json({ error: "SOURCE_NOT_CONFIGURED", message: "Live hotel source is not configured." }, { status: 503 });
  }

  const url = new URL(request.url);
  const destination = url.searchParams.get("destination") || "Turkey";
  const checkIn = url.searchParams.get("checkIn") || "";
  const checkOut = url.searchParams.get("checkOut") || "";
  const adults = Math.max(1, Math.min(5, Number(url.searchParams.get("guests") || 2)));
  const language = ["ru", "en", "tr"].includes(url.searchParams.get("language") || "") ? url.searchParams.get("language")! : "ru";
  const start = new Date(`${checkIn}T00:00:00Z`);
  const end = new Date(`${checkOut}T00:00:00Z`);
  const nights = Math.round((end.getTime() - start.getTime()) / 86400000);
  if (!checkIn || !checkOut || !Number.isFinite(nights) || nights < 1 || nights > 30) {
    return Response.json({ error: "INVALID_DATES", message: "Choose a stay from 1 to 30 nights." }, { status: 400 });
  }

  const query = destination === "Вся Турция" ? "Turkey hotels" : `${destination} Turkey hotels`;
  const baseParams = new URLSearchParams({
    engine: "google_hotels",
    q: query,
    check_in_date: checkIn,
    check_out_date: checkOut,
    adults: String(adults),
    children: "0",
    currency: "EUR",
    gl: "tr",
    hl: language,
    sort_by: "3",
    api_key: apiKey,
  });

  try {
    const rentalParams = new URLSearchParams(baseParams);
    rentalParams.set("vacation_rentals", "true");
    const [hotelSearch, rentalSearch] = await Promise.all([serpRequest(baseParams), serpRequest(rentalParams)]);
    const hotelProperties = ((hotelSearch.properties as SerpProperty[] | undefined) || []).filter((property) => property.property_token).slice(0, 7);
    const rentalProperties = ((rentalSearch.properties as SerpProperty[] | undefined) || []).filter((property) => property.property_token).slice(0, 5);
    const properties = Array.from(new Map([...hotelProperties, ...rentalProperties].map((property) => [property.property_token, property])).values());
    const checkedAt = new Date().toISOString();
    const details = await Promise.all(properties.map(async (property) => {
      const params = new URLSearchParams(baseParams);
      params.set("property_token", property.property_token!);
      if (property.type?.toLowerCase().includes("vacation")) params.set("vacation_rentals", "true");
      try {
        const detail = await serpRequest(params) as SerpProperty;
        return { base: property, detail };
      } catch {
        return { base: property, detail: property };
      }
    }));

    const offers = details.flatMap(({ base, detail }, index) => {
      const prices = [...(detail.featured_prices || []), ...(detail.prices || [])];
      const official = prices
        .filter((price) => price.official)
        .map((price) => ({ price, total: totalOf(price, nights) }))
        .filter((item): item is { price: SerpPrice; total: number } => item.total !== null)
        .sort((a, b) => a.total - b.total)[0];
      const deal = prices
        .filter((price) => !price.official && price.link)
        .map((price) => ({ price, total: totalOf(price, nights) }))
        .filter((item): item is { price: SerpPrice; total: number } => item.total !== null)
        .sort((a, b) => a.total - b.total)[0];
      if (!official || !deal || deal.total >= official.total) return [];
      const discount = Math.round((1 - deal.total / official.total) * 100);
      if (discount < 1) return [];
      const property = { ...base, ...detail };
      const image = property.images?.[0]?.original_image || property.images?.[0]?.thumbnail || "";
      const type = property.type?.toLowerCase().includes("vacation") ? "Вилла" : "Отель";
      return [{
        id: property.property_token || `live-${index}`,
        name: property.name || "Hotel",
        city: destination === "Вся Турция" ? "Вся Турция" : destination,
        area: property.address || destination,
        type,
        stars: property.extracted_hotel_class || 0,
        score: property.overall_rating || 0,
        reviews: property.reviews || 0,
        roomSize: null,
        guests: adults,
        price: Math.round(deal.total),
        oldPrice: Math.round(official.total),
        image,
        tags: [deal.price.source || "Booking source", deal.price.free_cancellation ? "Бесплатная отмена" : "Цена подтверждена"],
        feature: deal.price.source || "Booking source",
        distance: property.address || destination,
        link: deal.price.link,
        officialSource: official.price.source || property.name || "Official site",
        discount,
        checkedAt,
        live: true,
      }];
    }).sort((a, b) => b.discount - a.discount || a.price - b.price);

    return Response.json({ offers, checkedAt, searched: properties.length, source: "Google Hotels via SerpApi" }, {
      headers: { "Cache-Control": "private, max-age=900" },
    });
  } catch (error) {
    return Response.json({ error: "SOURCE_ERROR", message: error instanceof Error ? error.message : "Live search failed." }, { status: 502 });
  }
}
