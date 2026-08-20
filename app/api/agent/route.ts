type Language = "ru" | "en" | "tr";

type SearchFilters = {
  destination?: string;
  hotelName?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  rooms?: number;
  propertyType?: "Все варианты" | "Отель" | "Апарт-отель" | "Вилла";
  propertyTypes?: Array<"Отель" | "Апарт-отель" | "Вилла">;
  stars?: 0 | 3 | 4 | 5;
  maxPrice?: number;
  sizeRange?: "any" | "up-to-20" | "20-30" | "30-40" | "over-40";
  mealPlan?: "any" | "no-meals" | "breakfast" | "half-board" | "full-board" | "all-inclusive";
};

const destinations = [
  "Вся Турция", "Анталья", "Аланья", "Белек", "Сиде", "Кемер", "Бодрум", "Мармарис", "Фетхие",
  "Олюдениз", "Каш", "Кушадасы", "Чешме", "Дидим", "Даламан", "Сарыгерме", "Измир", "Стамбул", "Каппадокия",
] as const;

const propertyTypes = ["Все варианты", "Отель", "Апарт-отель", "Вилла"] as const;
const selectablePropertyTypes = ["Отель", "Апарт-отель", "Вилла"] as const;
const sizeRanges = ["any", "up-to-20", "20-30", "30-40", "over-40"] as const;
const mealPlans = ["any", "no-meals", "breakfast", "half-board", "full-board", "all-inclusive"] as const;

function validDate(value: unknown) {
  if (typeof value !== "string" || !/^202[67]-\d{2}-\d{2}$/.test(value)) return undefined;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(date.getTime()) ? undefined : value;
}

function cleanFilters(raw: unknown): SearchFilters {
  if (!raw || typeof raw !== "object") return {};
  const value = raw as Record<string, unknown>;
  const filters: SearchFilters = {};

  if (typeof value.destination === "string" && destinations.includes(value.destination as typeof destinations[number])) filters.destination = value.destination;
  if (typeof value.hotelName === "string" && value.hotelName.trim()) filters.hotelName = value.hotelName.trim().slice(0, 120);
  const checkIn = validDate(value.checkIn);
  const checkOut = validDate(value.checkOut);
  if (checkIn) filters.checkIn = checkIn;
  if (checkOut) filters.checkOut = checkOut;
  if (typeof value.guests === "number" && Number.isFinite(value.guests)) filters.guests = Math.max(1, Math.min(10, Math.round(value.guests)));
  if (typeof value.rooms === "number" && Number.isFinite(value.rooms)) filters.rooms = Math.max(1, Math.min(8, Math.round(value.rooms)));
  if (typeof value.propertyType === "string" && propertyTypes.includes(value.propertyType as typeof propertyTypes[number])) filters.propertyType = value.propertyType as SearchFilters["propertyType"];
  if (Array.isArray(value.propertyTypes)) {
    const next = value.propertyTypes.filter((item): item is typeof selectablePropertyTypes[number] => selectablePropertyTypes.includes(item as typeof selectablePropertyTypes[number]));
    if (next.length > 0) filters.propertyTypes = Array.from(new Set(next));
  }
  if (typeof value.stars === "number" && [0, 3, 4, 5].includes(value.stars)) filters.stars = value.stars as SearchFilters["stars"];
  if (typeof value.maxPrice === "number" && Number.isFinite(value.maxPrice)) filters.maxPrice = Math.max(400, Math.min(10000, Math.round(value.maxPrice / 100) * 100));
  if (typeof value.sizeRange === "string" && sizeRanges.includes(value.sizeRange as typeof sizeRanges[number])) filters.sizeRange = value.sizeRange as SearchFilters["sizeRange"];
  if (typeof value.mealPlan === "string" && mealPlans.includes(value.mealPlan as typeof mealPlans[number])) filters.mealPlan = value.mealPlan as SearchFilters["mealPlan"];

  if (filters.checkIn && filters.checkOut && filters.checkOut <= filters.checkIn) delete filters.checkOut;
  return filters;
}

function changedFilters(filters: SearchFilters, current: SearchFilters) {
  return Object.fromEntries(
    Object.entries(filters).filter(([key, value]) => current[key as keyof SearchFilters] !== value),
  ) as SearchFilters;
}

const fallbackReplies: Record<Language, string> = {
  ru: "Я подготовил условия отдыха. Проверьте их и нажмите «Применить и найти».",
  en: "I prepared your holiday preferences. Check them and select “Apply and search”.",
  tr: "Tatil tercihlerinizi hazırladım. Kontrol edip “Uygula ve ara” düğmesine basın.",
};

function envSetting(names: string[], fallback = "") {
  for (const name of names) {
    const raw = process.env[name]?.trim();
    if (!raw) continue;
    const matchingLine = raw.split(/\r?\n/).find((line) => names.some((item) => line.trim().startsWith(`${item}=`)));
    if (matchingLine) return matchingLine.split("=").slice(1).join("=").trim();
    if (!raw.includes("=") && !raw.includes("\n")) return raw;
  }
  return fallback;
}

export async function POST(request: Request) {
  const apiKey = envSetting(["OPENROUTER_API_KEY", "OPENROUTER_KEY"]);
  if (!apiKey) {
    return Response.json({ error: "AGENT_NOT_CONFIGURED" }, { status: 503 });
  }

  let body: { message?: unknown; language?: unknown; current?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "INVALID_REQUEST" }, { status: 400 });
  }

  const message = typeof body.message === "string" ? body.message.trim().slice(0, 1200) : "";
  const language: Language = body.language === "en" || body.language === "tr" ? body.language : "ru";
  const current = cleanFilters(body.current);
  if (!message) return Response.json({ error: "EMPTY_MESSAGE" }, { status: 400 });

  const today = new Date().toISOString().slice(0, 10);
  const model = envSetting(["OPENROUTER_MODEL", "OPENROUTER_MODULE", "OPENROUTER_MODEL_ID"], "deepseek/deepseek-v4-flash");
  const system = `You are Mareva AI, a concise hotel search assistant for Turkey. The interface language is ${language}.
Extract only preferences clearly stated by the user, including a specific hotel name when one is spoken. Do not invent hotel names, dates, budget, guests, rooms, category, meal plan, property type, or room size. Relative dates are resolved from ${today}. The portal calendar supports only 2026 and 2027. Use Russian canonical destination and property values exactly as specified by the tool schema, regardless of interface language. If the user names several property types, put them into propertyTypes. The current search is ${JSON.stringify(current)}; omit unchanged fields unless the user explicitly confirms or changes them. Always call prepare_hotel_search. Then write one brief friendly sentence in the interface language. Never claim that prices or availability were checked: another deterministic workflow performs that search.`;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": request.headers.get("origin") || "https://mareva-turkiye.wanderingspirit2003.chatgpt.site",
        "X-OpenRouter-Title": "Mareva Turkiye",
      },
      body: JSON.stringify({
        model,
        temperature: 0.1,
        messages: [
          { role: "system", content: system },
          { role: "user", content: message },
        ],
        tools: [{
          type: "function",
          function: {
            name: "prepare_hotel_search",
            description: "Prepare validated Mareva hotel search filters from the user's request.",
            parameters: {
              type: "object",
              additionalProperties: false,
              properties: {
                destination: { type: ["string", "null"], enum: [...destinations, null] },
                hotelName: { type: ["string", "null"], maxLength: 120, description: "Exact hotel or property name explicitly requested by the user." },
                checkIn: { type: ["string", "null"], description: "Check-in date as YYYY-MM-DD, only in 2026 or 2027." },
                checkOut: { type: ["string", "null"], description: "Check-out date as YYYY-MM-DD, only in 2026 or 2027." },
                guests: { type: ["integer", "null"], minimum: 1, maximum: 10 },
                rooms: { type: ["integer", "null"], minimum: 1, maximum: 8 },
                propertyType: { type: ["string", "null"], enum: [...propertyTypes, null] },
                propertyTypes: { type: ["array", "null"], items: { type: "string", enum: [...selectablePropertyTypes] }, uniqueItems: true, maxItems: 3 },
                stars: { type: ["integer", "null"], enum: [0, 3, 4, 5, null] },
                maxPrice: { type: ["number", "null"], minimum: 400, maximum: 10000, description: "Maximum price in EUR per night, not the total stay price." },
                sizeRange: { type: ["string", "null"], enum: [...sizeRanges, null] },
                mealPlan: { type: ["string", "null"], enum: [...mealPlans, null] },
              },
              required: ["destination", "hotelName", "checkIn", "checkOut", "guests", "rooms", "propertyType", "propertyTypes", "stars", "maxPrice", "sizeRange", "mealPlan"],
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "prepare_hotel_search" } },
      }),
    });

    const rawResponse = await response.text();
    let data: {
      error?: { message?: string };
      choices?: Array<{ message?: { content?: string | null; tool_calls?: Array<{ function?: { arguments?: string } }> } }>;
    };
    try {
      data = JSON.parse(rawResponse.trim());
    } catch {
      return Response.json({ error: "AGENT_UPSTREAM_TEXT", message: "OpenRouter returned a non-JSON response" }, { status: 502 });
    }
    if (!response.ok) {
      const upstreamMessage = typeof data.error === "string"
        ? data.error
        : data.error?.message || `OpenRouter returned HTTP ${response.status}`;
      return Response.json({ error: "AGENT_UPSTREAM_ERROR", message: upstreamMessage }, { status: 502 });
    }

    const assistant = data.choices?.[0]?.message;
    const argumentsText = assistant?.tool_calls?.[0]?.function?.arguments;
    let rawFilters: unknown = {};
    if (argumentsText) {
      try { rawFilters = JSON.parse(argumentsText); } catch { rawFilters = {}; }
    }
    const filters = changedFilters(cleanFilters(rawFilters), current);
    const reply = assistant?.content?.trim() || fallbackReplies[language];
    return Response.json({ reply, filters });
  } catch {
    return Response.json({ error: "AGENT_UNAVAILABLE", message: "OpenRouter request failed before response" }, { status: 502 });
  }
}
