"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

type Stay = {
  id: number | string;
  name: string;
  city: string;
  area: string;
  type: PropertyType;
  stars: number;
  score: number;
  reviews: number;
  roomSize: number | null;
  guests: number;
  price: number;
  oldPrice: number;
  image: string;
  images?: string[];
  tags: string[];
  feature: string;
  distance: string;
  link?: string;
  officialSource?: string;
  discount?: number;
  checkedAt?: string;
  live?: boolean;
};

type PropertyType = "Отель" | "Апарт-отель" | "Вилла";

const featuredStays: Stay[] = [
  {
    id: 1,
    name: "Lara Coastline Hotel",
    city: "Анталья",
    area: "Лара",
    type: "Отель",
    stars: 5,
    score: 9.1,
    reviews: 842,
    roomSize: 32,
    guests: 3,
    price: 684,
    oldPrice: 910,
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=82",
    tags: ["Завтрак включён", "Бесплатная отмена"],
    feature: "Собственный пляж",
    distance: "2 мин до моря",
  },
  {
    id: 2,
    name: "Kaleiçi Courtyard Suites",
    city: "Анталья",
    area: "Калеичи",
    type: "Апарт-отель",
    stars: 4,
    score: 9.4,
    reviews: 316,
    roomSize: 41,
    guests: 4,
    price: 512,
    oldPrice: 590,
    image:
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=82",
    tags: ["Кухня", "Оплата на месте"],
    feature: "Исторический центр",
    distance: "450 м до гавани",
  },
  {
    id: 3,
    name: "Bodrum White House",
    city: "Бодрум",
    area: "Ялыкавак",
    type: "Вилла",
    stars: 5,
    score: 9.2,
    reviews: 128,
    roomSize: 74,
    guests: 5,
    price: 1180,
    oldPrice: 1410,
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=82",
    tags: ["Отдельный дом", "Полный пансион"],
    feature: "Панорамный вид",
    distance: "8 мин до марины",
  },
  {
    id: 4,
    name: "Kaş Sea Rooms",
    city: "Каш",
    area: "Чукурбаг",
    type: "Отель",
    stars: 4,
    score: 9.6,
    reviews: 204,
    roomSize: 26,
    guests: 2,
    price: 438,
    oldPrice: 565,
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=82",
    tags: ["Только для взрослых", "Завтрак"],
    feature: "Тихая бухта",
    distance: "Первая линия",
  },
];

const stays: Stay[] = [
  ...featuredStays,
  {
    id: 5, name: "Alanya Citadel Beach", city: "Аланья", area: "Клеопатра", type: "Отель", stars: 4,
    score: 8.9, reviews: 672, roomSize: 19, guests: 2, price: 476, oldPrice: 610,
    image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1200&q=82",
    tags: ["Завтрак", "Бесплатная отмена"], feature: "Пляж Клеопатры", distance: "180 м до моря",
  },
  {
    id: 6, name: "Belek Pine Resort", city: "Белек", area: "Кадрие", type: "Отель", stars: 5,
    score: 9.0, reviews: 1134, roomSize: 36, guests: 4, price: 982, oldPrice: 1240,
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=82",
    tags: ["Всё включено", "Семейные номера"], feature: "Сосновый парк", distance: "Первая линия",
  },
  {
    id: 7, name: "Side Antique Garden", city: "Сиде", area: "Старый город", type: "Апарт-отель", stars: 4,
    score: 9.3, reviews: 287, roomSize: 39, guests: 4, price: 548, oldPrice: 690,
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=82",
    tags: ["Мини-кухня", "Терраса"], feature: "Рядом с античным городом", distance: "7 мин до пляжа",
  },
  {
    id: 8, name: "Kemer Mountain & Sea", city: "Кемер", area: "Кириш", type: "Отель", stars: 5,
    score: 8.8, reviews: 906, roomSize: 31, guests: 3, price: 734, oldPrice: 880,
    image: "https://images.unsplash.com/photo-1455587734955-081b22074882?auto=format&fit=crop&w=1200&q=82",
    tags: ["Всё включено", "Детский клуб"], feature: "Вид на Таврские горы", distance: "Первая линия",
  },
  {
    id: 9, name: "Marmaris Marina Residence", city: "Мармарис", area: "Сителер", type: "Апарт-отель", stars: 4,
    score: 9.2, reviews: 411, roomSize: 44, guests: 4, price: 596, oldPrice: 760,
    image: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=82",
    tags: ["Кухня", "Вид на марину"], feature: "Набережная", distance: "120 м до моря",
  },
  {
    id: 10, name: "Fethiye Harbour House", city: "Фетхие", area: "Карагёзлер", type: "Отель", stars: 4,
    score: 9.5, reviews: 358, roomSize: 29, guests: 2, price: 524, oldPrice: 680,
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=82",
    tags: ["Завтрак", "Только для взрослых"], feature: "Вид на гавань", distance: "У набережной",
  },
  {
    id: 11, name: "Ölüdeniz Lagoon Villa", city: "Олюдениз", area: "Оваджик", type: "Вилла", stars: 5,
    score: 9.4, reviews: 94, roomSize: 86, guests: 5, price: 1260, oldPrice: 1480,
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=82",
    tags: ["Отдельный дом", "Частный бассейн"], feature: "Для семьи или компании", distance: "9 мин до лагуны",
  },
  {
    id: 12, name: "Kuşadası Aegean Rooms", city: "Кушадасы", area: "Кадынлар Денизи", type: "Отель", stars: 4,
    score: 8.7, reviews: 519, roomSize: 25, guests: 3, price: 452, oldPrice: 575,
    image: "https://images.unsplash.com/photo-1535827841776-24afc1e255ac?auto=format&fit=crop&w=1200&q=82",
    tags: ["Завтрак", "Оплата на месте"], feature: "Эгейское побережье", distance: "250 м до пляжа",
  },
  {
    id: 13, name: "Çeşme Stone Suites", city: "Чешме", area: "Алачаты", type: "Апарт-отель", stars: 4,
    score: 9.6, reviews: 176, roomSize: 35, guests: 3, price: 638, oldPrice: 790,
    image: "https://images.unsplash.com/photo-1601918774946-25832a4be0d6?auto=format&fit=crop&w=1200&q=82",
    tags: ["Каменный дом", "Завтрак"], feature: "Центр Алачаты", distance: "12 мин до пляжа",
  },
  {
    id: 14, name: "Didim Blue Bay Hotel", city: "Дидим", area: "Алтынкум", type: "Отель", stars: 4,
    score: 8.8, reviews: 344, roomSize: 30, guests: 4, price: 418, oldPrice: 540,
    image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=82",
    tags: ["Полупансион", "Семейные номера"], feature: "Песчаный пляж", distance: "Первая линия",
  },
  {
    id: 15, name: "Dalaman Citrus House", city: "Даламан", area: "Каяджик", type: "Апарт-отель", stars: 3,
    score: 8.9, reviews: 138, roomSize: 38, guests: 4, price: 404, oldPrice: 485,
    image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=82",
    tags: ["Трансфер", "Мини-кухня"], feature: "Рядом с аэропортом", distance: "15 мин до Сарыгерме",
  },
  {
    id: 16, name: "Sarigerme Dune Resort", city: "Сарыгерме", area: "Пляж Сарыгерме", type: "Отель", stars: 5,
    score: 9.1, reviews: 603, roomSize: 34, guests: 4, price: 816, oldPrice: 1020,
    image: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=1200&q=82",
    tags: ["Всё включено", "Песчаный пляж"], feature: "Природный заповедник", distance: "Первая линия",
  },
  {
    id: 17, name: "İzmir Kordon Residence", city: "Измир", area: "Конак", type: "Апарт-отель", stars: 4,
    score: 9.0, reviews: 468, roomSize: 46, guests: 4, price: 566, oldPrice: 650,
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=82",
    tags: ["Кухня", "Долгое проживание"], feature: "Набережная Кордон", distance: "В центре города",
  },
  {
    id: 18, name: "Istanbul Bosphorus Rooms", city: "Стамбул", area: "Каракёй", type: "Отель", stars: 5,
    score: 9.3, reviews: 1238, roomSize: 27, guests: 2, price: 792, oldPrice: 940,
    image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=82",
    tags: ["Завтрак", "Вид на Босфор"], feature: "Исторический центр", distance: "5 мин до Галатапорта",
  },
  {
    id: 19, name: "Cappadocia Cave Atelier", city: "Каппадокия", area: "Гёреме", type: "Отель", stars: 4,
    score: 9.7, reviews: 522, roomSize: 33, guests: 3, price: 612, oldPrice: 755,
    image: "https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=1200&q=82",
    tags: ["Пещерный номер", "Завтрак"], feature: "Терраса для рассвета", distance: "Центр Гёреме",
  },
];

const destinations = [
  "Вся Турция", "Анталья", "Аланья", "Белек", "Сиде", "Кемер", "Бодрум", "Мармарис", "Фетхие",
  "Олюдениз", "Каш", "Кушадасы", "Чешме", "Дидим", "Даламан", "Сарыгерме", "Измир", "Стамбул", "Каппадокия",
].filter((item) => item === "Вся Турция" || stays.some((stay) => stay.city === item));

type Language = "ru" | "en" | "tr";
type HistoryItem = { id: number | string; kind: "search" | "booking"; destination: string; dates: string; guests: number };
type AgentFilters = {
  destination?: string;
  hotelName?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  rooms?: number;
  propertyType?: "Все варианты" | PropertyType;
  propertyTypes?: PropertyType[];
  stars?: 0 | 3 | 4 | 5;
  maxPrice?: number;
  sizeRange?: "any" | "up-to-20" | "20-30" | "30-40" | "over-40";
  mealPlan?: "any" | "no-meals" | "breakfast" | "half-board" | "full-board" | "all-inclusive";
};
type AgentMessage = { id: string; role: "user" | "assistant"; text: string; filters?: AgentFilters };
type SearchOverrides = { destination?: string; hotelName?: string; checkIn?: string; checkOut?: string; guests?: number; rooms?: number; propertyTypes?: PropertyType[]; maxPrice?: number; language?: Language };
type SearchCursor = { scopeIndex?: number; pageToken?: string; offset: number };
type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: ((event: { error?: string }) => void) | null;
  onresult: ((event: { results: ArrayLike<{ 0: { transcript: string } }> }) => void) | null;
  start: () => void;
  stop: () => void;
};
type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

const monthNumbers: Record<string, string> = {
  января: "01", январь: "01", january: "01", ocak: "01",
  февраля: "02", февраль: "02", february: "02", subat: "02", şubat: "02",
  марта: "03", март: "03", march: "03", mart: "03",
  апреля: "04", апрель: "04", april: "04", nisan: "04",
  мая: "05", май: "05", may: "05", mayis: "05", mayıs: "05",
  июня: "06", июнь: "06", june: "06", haziran: "06",
  июля: "07", июль: "07", july: "07", temmuz: "07",
  августа: "08", август: "08", august: "08", agustos: "08", ağustos: "08",
  сентября: "09", сентябрь: "09", september: "09", eylul: "09", eylül: "09",
  октября: "10", октябрь: "10", october: "10", ekim: "10",
  ноября: "11", ноябрь: "11", november: "11", kasim: "11", kasım: "11",
  декабря: "12", декабрь: "12", december: "12", aralik: "12", aralık: "12",
};

const spokenNumbers: Record<string, number> = {
  один: 1, one: 1, bir: 1,
  два: 2, двое: 2, two: 2, iki: 2,
  три: 3, three: 3, uc: 3, üç: 3,
  четыре: 4, four: 4, dort: 4, dört: 4,
  пять: 5, five: 5, bes: 5, beş: 5,
  шесть: 6, six: 6, alti: 6, altı: 6,
  семь: 7, seven: 7, yedi: 7,
  восемь: 8, eight: 8, sekiz: 8,
  девять: 9, nine: 9, dokuz: 9,
  десять: 10, ten: 10, on: 10,
};

function normalizeSpeech(value: string) {
  return value.toLowerCase().replace(/ё/g, "е").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function isoDate(day: number, month: string, year = 2026) {
  return `${year}-${month}-${String(day).padStart(2, "0")}`;
}

function parseSpokenQuantity(normalized: string, nouns: string) {
  const digit = normalized.match(new RegExp(`(\\d{1,2})\\s*(?:${nouns})`));
  if (digit) return Number(digit[1]);
  for (const [word, value] of Object.entries(spokenNumbers)) {
    if (new RegExp(`\\b${word}\\b\\s*(?:${nouns})`).test(normalized)) return value;
  }
  return undefined;
}

function parseLocalAgentFilters(message: string): AgentFilters {
  const normalized = normalizeSpeech(message);
  const filters: AgentFilters = {};
  const destination = destinations.find((item) => item !== "Вся Турция" && normalized.includes(normalizeSpeech(item)));
  if (destination) filters.destination = destination;
  else if (/(вся|всю|all|whole).{0,12}(турц|turkey|turkiye)/.test(normalized)) filters.destination = "Вся Турция";

  const propertyTypes: PropertyType[] = [];
  if (/\b(отел|hotel|otel)\b/.test(normalized)) propertyTypes.push("Отель");
  if (/(апарт|apart)/.test(normalized)) propertyTypes.push("Апарт-отель");
  if (/\b(вилла|villa|виллу|виллы)\b/.test(normalized)) propertyTypes.push("Вилла");
  if (propertyTypes.length > 0) filters.propertyTypes = propertyTypes;

  const starMatch = normalized.match(/([345])\s*(?:звезд|звезды|звездоч|star|yildiz|yıldız|★)/);
  if (starMatch) filters.stars = Number(starMatch[1]) as 3 | 4 | 5;

  const guests = parseSpokenQuantity(normalized, "гост|гостя|гостей|человек|персон|guest|guests|person|people|kisi|kişi");
  if (guests) filters.guests = Math.max(1, Math.min(10, guests));

  const rooms = parseSpokenQuantity(normalized, "номер|номера|номеров|room|rooms|oda");
  if (rooms) filters.rooms = Math.max(1, Math.min(8, rooms));

  const compactDate = normalized.match(/(?:с|from)?\s*(\d{1,2})[.\\/-](\d{1,2})(?:[.\\/-](202[67]))?\s*(?:-|—|по|до|to)\s*(\d{1,2})[.\\/-](\d{1,2})(?:[.\\/-](202[67]))?/);
  if (compactDate) {
    const startYear = compactDate[3] ? Number(compactDate[3]) : 2026;
    const endYear = compactDate[6] ? Number(compactDate[6]) : startYear;
    filters.checkIn = isoDate(Number(compactDate[1]), String(compactDate[2]).padStart(2, "0"), startYear);
    filters.checkOut = isoDate(Number(compactDate[4]), String(compactDate[5]).padStart(2, "0"), endYear);
    return filters;
  }

  const monthPattern = Object.keys(monthNumbers).join("|");
  const twoNamedDates = normalized.match(new RegExp(`(?:с|from)?\\s*(\\d{1,2})\\s*(${monthPattern})\\s*(?:-|—|по|до|to)\\s*(\\d{1,2})\\s*(${monthPattern})(?:\\s*(202[67]))?`));
  if (twoNamedDates) {
    const year = twoNamedDates[5] ? Number(twoNamedDates[5]) : 2026;
    filters.checkIn = isoDate(Number(twoNamedDates[1]), monthNumbers[twoNamedDates[2]], year);
    filters.checkOut = isoDate(Number(twoNamedDates[3]), monthNumbers[twoNamedDates[4]], year);
    return filters;
  }

  const namedDate = normalized.match(new RegExp(`(?:с|from)?\\s*(\\d{1,2})\\s*(?:-|—|по|до|to)\\s*(\\d{1,2})\\s*(${monthPattern})(?:\\s*(202[67]))?`));
  if (namedDate) {
    const year = namedDate[4] ? Number(namedDate[4]) : 2026;
    const month = monthNumbers[namedDate[3]];
    filters.checkIn = isoDate(Number(namedDate[1]), month, year);
    filters.checkOut = isoDate(Number(namedDate[2]), month, year);
  }

  return filters;
}

function localAgentFallbackReply(language: Language) {
  if (language === "en") return "AI is temporarily unavailable, but I recognized the main search conditions locally.";
  if (language === "tr") return "AI geçici olarak kullanılamıyor, ancak temel arama koşullarını yerel olarak tanıdım.";
  return "AI временно недоступен, но я распознал основные условия поиска локально.";
}

function guestLabel(count: number, language: Language) {
  if (language === "tr") return "misafir";
  if (language === "en") return count === 1 ? "guest" : "guests";
  return count === 1 ? "гость" : count < 5 ? "гостя" : "гостей";
}

function roomLabel(count: number, language: Language) {
  if (language === "tr") return "oda";
  if (language === "en") return count === 1 ? "room" : "rooms";
  return count === 1 ? "номер" : count < 5 ? "номера" : "номеров";
}

const destinationNames: Record<Language, Record<string, string>> = {
  ru: Object.fromEntries(destinations.map((item) => [item, item])),
  en: {
    "Вся Турция": "All Turkey", "Анталья": "Antalya", "Аланья": "Alanya", "Белек": "Belek", "Сиде": "Side",
    "Кемер": "Kemer", "Бодрум": "Bodrum", "Мармарис": "Marmaris", "Фетхие": "Fethiye", "Олюдениз": "Oludeniz",
    "Каш": "Kas", "Кушадасы": "Kusadasi", "Чешме": "Cesme", "Дидим": "Didim", "Даламан": "Dalaman",
    "Сарыгерме": "Sarigerme", "Измир": "Izmir", "Стамбул": "Istanbul", "Каппадокия": "Cappadocia",
  },
  tr: {
    "Вся Турция": "Tüm Türkiye", "Анталья": "Antalya", "Аланья": "Alanya", "Белек": "Belek", "Сиде": "Side",
    "Кемер": "Kemer", "Бодрум": "Bodrum", "Мармарис": "Marmaris", "Фетхие": "Fethiye", "Олюдениз": "Ölüdeniz",
    "Каш": "Kaş", "Кушадасы": "Kuşadası", "Чешме": "Çeşme", "Дидим": "Didim", "Даламан": "Dalaman",
    "Сарыгерме": "Sarıgerme", "Измир": "İzmir", "Стамбул": "İstanbul", "Каппадокия": "Kapadokya",
  },
};

const translations = {
  ru: {
    findStay: "Найти место для отдыха", how: "Как это работает", favorites: "Избранное", login: "Войти", register: "Регистрация", account: "Аккаунт",
    eyebrow: "Независимый поиск по Турции", heroA: "Турция.", heroB: "Без переплаты.",
    heroCopy: "Собираем предложения отелей, апарт-отелей и вилл и показываем только те, где цена со скидкой ниже цены до скидки.", heroPromise: "Экономим ваши деньги. Качество отдыха неизменно.",
    where: "Куда", hotelSearch: "Название отеля", hotelPlaceholder: "Любой отель", checkIn: "Заезд", checkOut: "Выезд", guests: "Гости", rooms: "Номера", find: "Найти", searching: "Ищем…", searchTitle: "Ищем лучшие предложения", searchDetail: "Проверяем реальные скидки и цены на выбранные даты", popular: "Популярно:",
    selectDates: "Выберите даты", chooseArrival: "Сначала выберите дату заезда", chooseDeparture: "Теперь выберите дату выезда", close: "Закрыть", clearDates: "Очистить", dateNext: "Далее", year: "Год", previousMonth: "Предыдущий месяц", nextMonth: "Следующий месяц",
    benefits: [["Цена со скидкой", "Ниже цены без скидки на те же даты"], ["Один объект — одна карточка", "Без дублей в выдаче"], ["Прямой переход", "Бронирование у источника"], ["Только экономия", "Предложения без скидки не показываем"]],
    picked: "Подобрали для вас", allTurkey: "Отдых по всей Турции", housing: "Отдых", variants: "вариантов в прототипе", filters: "Фильтры", reset: "Сбросить",
    sort: "Сортировка", sortDeal: "Выгодные сначала", sortCheap: "Сначала дешевле", sortRating: "По рейтингу", type: "Тип жилья", category: "Категория", all: "Все",
    allTypes: "Все варианты", hotel: "Отель", apart: "Апарт-отель", villa: "Вилла", area: "Площадь номера", anyArea: "Любая площадь", up20: "До 20 м²", from20: "От 20 до 30 м²", from30: "От 30 до 40 м²", over40: "Выше 40 м²",
    price: "Максимальная цена за сутки", upTo: "до", meal: "Питание", anyMeal: "Любое питание", noMeal: "Без питания", breakfast: "Завтрак включён", halfBoard: "Полупансион · завтрак и ужин", fullBoard: "Полный пансион · завтрак, обед и ужин", allInclusive: "Всё включено", webTitle: "Поиск без договоров", webText: "Открытые страницы и поисковые ссылки. Цена всегда перепроверяется на сайте источника.",
    excellent: "Превосходно", reviews: "отзывов", upToGuests: "до", guestWord: "гостей", demoPrice: "за 6 ночей · демо-цена", perNight: "за сутки", totalStay: "за весь период", checkWeb: "Проверить в интернете",
    requestReady: "Живой поиск завершён", requestText: "Сначала показаны варианты со скидкой, ниже — другие подходящие предложения.", noMatches: "Подходящих вариантов пока нет", expand: "Попробуйте другие даты, направление или условия.", showTurkey: "Искать по всей Турции", showMore: "Показать ещё", loadingMore: "Загружаем ещё…", previousPhoto: "Предыдущая фотография", nextPhoto: "Следующая фотография", deal: "к цене до скидки", regularOption: "Обычный вариант", startLive: "Задайте даты и запустите живой поиск", sourceMissing: "Для живого поиска требуется подключить технический ключ источника цен.", sizeAtSource: "Площадь у источника", officialPrice: "цена до скидки", checkedNow: "проверено сейчас",
    howKicker: "Как работает Mareva", howA: "Мы ищем.", howB: "Вы выбираете.", howCopy: "Портал не принимает оплату и не скрывает источник предложения. На первом этапе он помогает сформировать точный запрос и проверить вариант в открытом интернете.",
    steps: [["Задайте условия", "Направление, даты, гости, тип жилья, площадь и бюджет."], ["Сравните варианты", "Единый формат карточек помогает быстро убрать неподходящее."], ["Проверьте цену", "Откроется свежая поисковая выдача с названием и городом объекта."], ["Бронируйте у источника", "Оплата и подтверждение происходят на выбранном внешнем сайте."]],
    roadmapKicker: "Развитие продукта", roadmapA: "Сегодня — веб-поиск.", roadmapB: "Завтра — единая цена.", roadmap: [["Сейчас", "Открытый веб-поиск", "Прямые ссылки, официальные сайты, ручная перепроверка."], ["Этап 2", "Поисковые API", "Автоматический сбор доступных страниц и обнаружение объектов."], ["Этап 3", "Партнёрские цены", "Наличие, точная стоимость и сравнение источников внутри портала."]], footerText: "Независимый поиск отдыха в Турции. Прототип MVP.", catalog: "Каталог", howSearch: "Как мы ищем",
    profileTitle: "Мой аккаунт", recent: "10 последних действий", localOnly: "Демо-кабинет: история хранится только в этом браузере.", search: "Поиск", booking: "Бронь", repeat: "Повторить",
    loginTitle: "Вход в Mareva", registerTitle: "Создать аккаунт", email: "Электронная почта", password: "Пароль", name: "Имя", patronymic: "Отчество", optional: "необязательно", continue: "Продолжить", create: "Создать аккаунт", authNote: "Демо-кабинет: достаточно имени, почта необязательна.", logout: "Выйти", favoritesTitle: "Избранное в аккаунте", noFavorites: "Сохраняйте понравившиеся варианты сердечком.", guestNote: "Искать и бронировать можно без регистрации. Гостевое избранное хранится только в текущей сессии.", keepFavorites: "Сохранить избранное в аккаунте",
    aiName: "Mareva AI", aiBadge: "OpenRouter", aiIntro: "Опишите отдых своими словами — я заполню фильтры и подготовлю поиск скидок.", aiPlaceholder: "Например: вилла в Бодруме на 6 гостей…", aiSend: "Отправить", aiThinking: "Подбираю условия…", aiApply: "Применить и найти", aiApplied: "Условия применены — запускаю поиск скидок.", aiError: "Не удалось связаться с AI-агентом. Попробуйте ещё раз.", aiClose: "Закрыть помощника", voiceSearch: "Сказать условия голосом", voiceListening: "Говорите — я слушаю", voiceUnavailable: "Голосовой ввод недоступен в этом браузере. Можно написать запрос помощнику.", hotelNameLabel: "Отель", aiExamples: ["Пятизвёздочный отель в Сиде для двоих", "Вилла в Бодруме на 6 гостей", "Анталья, всё включено, до 1000 евро"],
  },
  en: {
    findStay: "Find a stay", how: "How it works", favorites: "Favorites", login: "Sign in", register: "Register", account: "Account",
    eyebrow: "Independent search across Turkey", heroA: "Turkey.", heroB: "Without overpaying.",
    heroCopy: "We find live deals priced below the regular price. You save money while the quality of your holiday stays the same.", heroPromise: "Save money. Not memories.",
    where: "Where", hotelSearch: "Hotel name", hotelPlaceholder: "Any hotel", checkIn: "Check-in", checkOut: "Check-out", guests: "Guests", rooms: "Rooms", find: "Search", searching: "Searching…", searchTitle: "Searching for the best deals", searchDetail: "Checking live discounts and prices for your dates", popular: "Popular:",
    selectDates: "Select dates", chooseArrival: "Choose your check-in date first", chooseDeparture: "Now choose your check-out date", close: "Close", clearDates: "Clear", dateNext: "Continue", year: "Year", previousMonth: "Previous month", nextMonth: "Next month",
    benefits: [["Discounted price", "Below the regular price for the same dates"], ["One property, one card", "No duplicates"], ["Direct handoff", "Book with the source"], ["Savings only", "Offers without a discount are hidden"]],
    picked: "Selected for you", allTurkey: "Stays across Turkey", housing: "Stays", variants: "prototype options", filters: "Filters", reset: "Reset",
    sort: "Sort", sortDeal: "Best deals first", sortCheap: "Lowest price", sortRating: "Highest rating", type: "Property type", category: "Category", all: "All",
    allTypes: "All properties", hotel: "Hotel", apart: "Aparthotel", villa: "Villa", area: "Room size", anyArea: "Any size", up20: "Up to 20 m²", from20: "20 to 30 m²", from30: "30 to 40 m²", over40: "Over 40 m²",
    price: "Maximum price per night", upTo: "up to", meal: "Meal plan", anyMeal: "Any meal plan", noMeal: "No meals", breakfast: "Breakfast included", halfBoard: "Half board · breakfast and dinner", fullBoard: "Full board · breakfast, lunch and dinner", allInclusive: "All inclusive", webTitle: "Open web search", webText: "Public pages and search links. Always verify the final price with the source.",
    excellent: "Excellent", reviews: "reviews", upToGuests: "up to", guestWord: "guests", demoPrice: "6 nights · demo price", perNight: "per night", totalStay: "total stay", checkWeb: "Check on the web",
    requestReady: "Live search complete", requestText: "Discounted stays are shown first, followed by other matching options.", noMatches: "No matching stays yet", expand: "Try other dates, a wider destination or different preferences.", showTurkey: "Search all Turkey", showMore: "Show more", loadingMore: "Loading more…", previousPhoto: "Previous photo", nextPhoto: "Next photo", deal: "below regular price", regularOption: "Regular option", startLive: "Choose dates and run a live search", sourceMissing: "Live search needs a technical price-source key.", sizeAtSource: "Room size at source", officialPrice: "price before discount", checkedNow: "checked now",
    howKicker: "How Mareva works", howA: "We search.", howB: "You choose.", howCopy: "Mareva does not take payments or hide the offer source. At this stage it builds a precise request and helps you verify it on the open web.",
    steps: [["Set your preferences", "Destination, dates, guests, property type, room size and budget."], ["Compare options", "A consistent card format makes unsuitable stays easy to remove."], ["Check the price", "A fresh web search opens with the property name and city."], ["Book with the source", "Payment and confirmation happen on the external site you choose."]],
    roadmapKicker: "Product roadmap", roadmapA: "Today — web search.", roadmapB: "Tomorrow — one live price.", roadmap: [["Now", "Open web search", "Direct links, official websites and manual verification."], ["Stage 2", "Search APIs", "Automated discovery across permitted public pages."], ["Stage 3", "Partner pricing", "Availability, exact totals and source comparison inside Mareva."]], footerText: "Independent search for stays in Turkey. MVP prototype.", catalog: "Catalog", howSearch: "How we search",
    profileTitle: "My account", recent: "10 latest activities", localOnly: "Demo account: history is stored only in this browser.", search: "Search", booking: "Booking", repeat: "Repeat",
    loginTitle: "Sign in to Mareva", registerTitle: "Create an account", email: "Email", password: "Password", name: "Name", patronymic: "Middle name", optional: "optional", continue: "Continue", create: "Create account", authNote: "Demo account: a name is enough; email is optional.", logout: "Sign out", favoritesTitle: "Account favorites", noFavorites: "Save places you like with the heart button.", guestNote: "You can search and book without registering. Guest favorites last for this session only.", keepFavorites: "Save favorites to an account",
    aiName: "Mareva AI", aiBadge: "OpenRouter", aiIntro: "Describe your holiday naturally — I’ll fill the filters and prepare a discount search.", aiPlaceholder: "For example: a Bodrum villa for 6 guests…", aiSend: "Send", aiThinking: "Preparing preferences…", aiApply: "Apply and search", aiApplied: "Preferences applied — starting the discount search.", aiError: "The AI assistant could not respond. Please try again.", aiClose: "Close assistant", voiceSearch: "Describe your trip by voice", voiceListening: "Speak now — I’m listening", voiceUnavailable: "Voice input is unavailable in this browser. You can type your request to the assistant.", hotelNameLabel: "Hotel", aiExamples: ["Five-star hotel in Side for two", "A Bodrum villa for 6 guests", "Antalya, all inclusive, under €1,000"],
  },
  tr: {
    findStay: "Konaklama bul", how: "Nasıl çalışır", favorites: "Favoriler", login: "Giriş", register: "Kayıt ol", account: "Hesabım",
    eyebrow: "Türkiye genelinde bağımsız arama", heroA: "Türkiye.", heroB: "Fazla ödemeden.",
    heroCopy: "Resmi fiyattan daha düşük güncel fırsatları buluruz. Siz tasarruf ederken tatil kalitesi değişmez.", heroPromise: "Paradan tasarruf edin. Anılardan değil.",
    where: "Nereye", hotelSearch: "Otel adı", hotelPlaceholder: "Herhangi bir otel", checkIn: "Giriş", checkOut: "Çıkış", guests: "Misafir", rooms: "Odalar", find: "Ara", searching: "Aranıyor…", searchTitle: "En iyi fırsatlar aranıyor", searchDetail: "Seçtiğiniz tarihler için güncel indirimler ve fiyatlar kontrol ediliyor", popular: "Popüler:",
    selectDates: "Tarihleri seçin", chooseArrival: "Önce giriş tarihini seçin", chooseDeparture: "Şimdi çıkış tarihini seçin", close: "Kapat", clearDates: "Temizle", dateNext: "Devam", year: "Yıl", previousMonth: "Önceki ay", nextMonth: "Sonraki ay",
    benefits: [["İndirimli fiyat", "Aynı tarihlerde resmi fiyattan düşük"], ["Bir tesis, bir kart", "Tekrarsız sonuçlar"], ["Doğrudan yönlendirme", "Kaynakta rezervasyon"], ["Yalnızca tasarruf", "Tam fiyatlı tesisler gizlenir"]],
    picked: "Sizin için seçtik", allTurkey: "Türkiye genelinde konaklama", housing: "Konaklama", variants: "prototip seçeneği", filters: "Filtreler", reset: "Sıfırla",
    sort: "Sıralama", sortDeal: "En iyi fırsatlar", sortCheap: "En düşük fiyat", sortRating: "En yüksek puan", type: "Konaklama türü", category: "Kategori", all: "Tümü",
    allTypes: "Tüm seçenekler", hotel: "Otel", apart: "Apart otel", villa: "Villa", area: "Oda büyüklüğü", anyArea: "Tüm büyüklükler", up20: "20 m²'ye kadar", from20: "20–30 m²", from30: "30–40 m²", over40: "40 m² üzeri",
    price: "Gecelik maksimum fiyat", upTo: "en fazla", meal: "Yemek planı", anyMeal: "Tüm yemek planları", noMeal: "Yemeksiz", breakfast: "Kahvaltı dahil", halfBoard: "Yarım pansiyon · kahvaltı ve akşam yemeği", fullBoard: "Tam pansiyon · kahvaltı, öğle ve akşam yemeği", allInclusive: "Her şey dahil", webTitle: "Açık web araması", webText: "Herkese açık sayfalar ve arama bağlantıları. Son fiyatı her zaman kaynakta doğrulayın.",
    excellent: "Mükemmel", reviews: "yorum", upToGuests: "en fazla", guestWord: "misafir", demoPrice: "6 gece · demo fiyat", perNight: "gecelik", totalStay: "toplam konaklama", checkWeb: "Web'de kontrol et",
    requestReady: "Canlı arama tamamlandı", requestText: "İndirimli seçenekler önce, diğer uygun seçenekler sonra gösterilir.", noMatches: "Uygun seçenek bulunamadı", expand: "Farklı tarihler, konum veya koşullar deneyin.", showTurkey: "Tüm Türkiye'de ara", showMore: "Daha fazla göster", loadingMore: "Daha fazlası yükleniyor…", previousPhoto: "Önceki fotoğraf", nextPhoto: "Sonraki fotoğraf", deal: "normal fiyata göre", regularOption: "Normal seçenek", startLive: "Tarihleri seçip canlı aramayı başlatın", sourceMissing: "Canlı arama için teknik fiyat kaynağı anahtarı gerekir.", sizeAtSource: "Oda büyüklüğü kaynakta", officialPrice: "indirim öncesi fiyat", checkedNow: "şimdi kontrol edildi",
    howKicker: "Mareva nasıl çalışır", howA: "Biz ararız.", howB: "Siz seçersiniz.", howCopy: "Mareva ödeme almaz ve teklif kaynağını gizlemez. İlk aşamada kesin bir arama oluşturur ve açık web'de doğrulamanıza yardımcı olur.",
    steps: [["Koşulları belirleyin", "Konum, tarihler, misafirler, konaklama türü, oda büyüklüğü ve bütçe."], ["Seçenekleri karşılaştırın", "Tek kart düzeni uygun olmayan seçenekleri kolayca elemenizi sağlar."], ["Fiyatı kontrol edin", "Tesis adı ve şehirle güncel web araması açılır."], ["Kaynakta rezervasyon yapın", "Ödeme ve onay seçtiğiniz dış sitede gerçekleşir."]],
    roadmapKicker: "Ürün yol haritası", roadmapA: "Bugün — web araması.", roadmapB: "Yarın — tek güncel fiyat.", roadmap: [["Şimdi", "Açık web araması", "Doğrudan bağlantılar, resmi siteler ve manuel kontrol."], ["Aşama 2", "Arama API'leri", "İzin verilen sayfalarda otomatik tesis keşfi."], ["Aşama 3", "Ortak fiyatları", "Mareva içinde müsaitlik, toplam fiyat ve kaynak karşılaştırması."]], footerText: "Türkiye'de bağımsız konaklama araması. MVP prototipi.", catalog: "Katalog", howSearch: "Nasıl ararız",
    profileTitle: "Hesabım", recent: "Son 10 işlem", localOnly: "Demo hesap: geçmiş yalnızca bu tarayıcıda saklanır.", search: "Arama", booking: "Rezervasyon", repeat: "Tekrarla",
    loginTitle: "Mareva'ya giriş", registerTitle: "Hesap oluştur", email: "E-posta", password: "Şifre", name: "Ad", patronymic: "İkinci ad", optional: "isteğe bağlı", continue: "Devam et", create: "Hesap oluştur", authNote: "Demo hesap: ad yeterlidir; e-posta isteğe bağlıdır.", logout: "Çıkış", favoritesTitle: "Hesaptaki favoriler", noFavorites: "Beğendiğiniz yerleri kalp düğmesiyle kaydedin.", guestNote: "Kayıt olmadan arama ve rezervasyon yapabilirsiniz. Misafir favorileri yalnızca bu oturumda saklanır.", keepFavorites: "Favorileri hesaba kaydet",
    aiName: "Mareva AI", aiBadge: "OpenRouter", aiIntro: "Tatilinizi doğal biçimde anlatın; filtreleri doldurup indirim aramasını hazırlayayım.", aiPlaceholder: "Örneğin: Bodrum'da 6 kişilik villa…", aiSend: "Gönder", aiThinking: "Tercihler hazırlanıyor…", aiApply: "Uygula ve ara", aiApplied: "Tercihler uygulandı — indirim araması başlıyor.", aiError: "AI asistanına ulaşılamadı. Lütfen tekrar deneyin.", aiClose: "Asistanı kapat", voiceSearch: "Koşulları sesle söyle", voiceListening: "Konuşun — dinliyorum", voiceUnavailable: "Bu tarayıcıda sesli giriş kullanılamıyor. İsteğinizi asistana yazabilirsiniz.", hotelNameLabel: "Otel", aiExamples: ["Side'de iki kişilik beş yıldızlı otel", "Bodrum'da 6 kişilik villa", "Antalya, her şey dahil, 1000 € altı"],
  },
} as const;

const initialHistory: HistoryItem[] = [
  { id: 1, kind: "search", destination: "Анталья", dates: "14–20.09.2026", guests: 2 },
  { id: 2, kind: "booking", destination: "Бодрум", dates: "02–08.08.2026", guests: 2 },
  { id: 3, kind: "search", destination: "Мармарис", dates: "21–27.07.2026", guests: 4 },
  { id: 4, kind: "search", destination: "Сиде", dates: "10–16.07.2026", guests: 3 },
  { id: 5, kind: "booking", destination: "Кемер", dates: "04–09.06.2026", guests: 2 },
  { id: 6, kind: "search", destination: "Фетхие", dates: "11–18.05.2026", guests: 2 },
  { id: 7, kind: "search", destination: "Каш", dates: "22–27.04.2026", guests: 2 },
  { id: 8, kind: "search", destination: "Белек", dates: "13–19.04.2026", guests: 5 },
  { id: 9, kind: "search", destination: "Чешме", dates: "05–11.03.2026", guests: 2 },
  { id: 10, kind: "search", destination: "Стамбул", dates: "18–22.02.2026", guests: 1 },
];

function parseIso(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function toIso(value: Date) {
  return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}-${String(value.getDate()).padStart(2, "0")}`;
}

function mealPlanOf(stay: Stay) {
  if (stay.id === 3) return "full-board";
  if (stay.tags.some((tag) => tag === "Всё включено")) return "all-inclusive";
  if (stay.tags.some((tag) => tag === "Полупансион")) return "half-board";
  if (stay.tags.some((tag) => tag.includes("Завтрак"))) return "breakfast";
  return "no-meals";
}

function CalendarMonth({ month, language, checkIn, checkOut, onPick }: { month: Date; language: Language; checkIn: string; checkOut: string; onPick: (date: Date) => void }) {
  const locale = language === "ru" ? "ru-RU" : language === "tr" ? "tr-TR" : "en-GB";
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const firstWeekday = (new Date(year, monthIndex, 1).getDay() + 6) % 7;
  const daysCount = new Date(year, monthIndex + 1, 0).getDate();
  const cells = Array.from({ length: 42 }, (_, index) => {
    const day = index - firstWeekday + 1;
    return day > 0 && day <= daysCount ? new Date(year, monthIndex, day) : null;
  });
  const weekdayBase = new Date(2026, 7, 10);
  const weekdays = Array.from({ length: 7 }, (_, index) => new Intl.DateTimeFormat(locale, { weekday: "long" }).format(new Date(weekdayBase.getFullYear(), weekdayBase.getMonth(), weekdayBase.getDate() + index)));
  const start = checkIn ? parseIso(checkIn).getTime() : Number.NaN;
  const end = checkOut ? parseIso(checkOut).getTime() : Number.NaN;
  const monthTitle = language === "ru"
    ? `${new Intl.DateTimeFormat(locale, { month: "long" }).format(month)} ${year} год`
    : new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(month);
  return (
    <div className="calendar-month">
      <h3>{monthTitle}</h3>
      <div className="weekdays">{weekdays.map((day) => <span key={day}>{day}</span>)}</div>
      <div className="days-grid">
        {cells.map((date, index) => date ? (
          <button key={toIso(date)} type="button" aria-label={new Intl.DateTimeFormat(locale, { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(date)} aria-pressed={date.getTime() === start || date.getTime() === end} className={`${date.getTime() === start || date.getTime() === end ? "selected" : ""} ${date.getTime() > start && date.getTime() < end ? "in-range" : ""}`} onClick={() => onPick(date)}>{date.getDate()}</button>
        ) : <span key={`blank-${index}`} />)}
      </div>
    </div>
  );
}

function Stars({ count }: { count: number }) {
  return <span className="stars" aria-label={`${count} звёзд`}>{"★".repeat(count)}</span>;
}

function outboundUrl(stay: Stay, destination: string) {
  const place = destination === "Вся Турция" ? stay.city : destination;
  return `https://www.google.com/travel/search?q=${encodeURIComponent(`${stay.name} ${place} Turkey hotel`)}`;
}

function demoOffersForSearch({
  destination,
  hotelName,
  guests,
  rooms,
  propertyTypes,
  maxPrice,
  nights,
}: {
  destination: string;
  hotelName: string;
  guests: number;
  rooms: number;
  propertyTypes: PropertyType[];
  maxPrice: number;
  nights: number;
}) {
  const hotelQuery = hotelName.trim().toLowerCase();
  return stays.filter((stay) => {
    const cityOk = destination === "Вся Турция" || stay.city === destination;
    const nameOk = !hotelQuery || stay.name.toLowerCase().includes(hotelQuery);
    const typeOk = propertyTypes.length === 0 || propertyTypes.includes(stay.type);
    return cityOk && nameOk && typeOk && stay.guests * rooms >= guests && stay.price / nights <= maxPrice;
  });
}

async function trackActivity(eventType: "visit" | "search" | "outbound", destination?: string) {
  let sessionId = window.sessionStorage.getItem("mareva-session-id");
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    window.sessionStorage.setItem("mareva-session-id", sessionId);
  }
  await fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ eventType, destination, sessionId }),
  }).catch(() => undefined);
}

export default function Home() {
  const [language, setLanguage] = useState<Language>("ru");
  const [destination, setDestination] = useState("Вся Турция");
  const [hotelName, setHotelName] = useState("");
  const [checkIn, setCheckIn] = useState("2026-09-14");
  const [checkOut, setCheckOut] = useState("2026-09-20");
  const [guests, setGuests] = useState(2);
  const [rooms, setRooms] = useState(1);
  const [selectedTypes, setSelectedTypes] = useState<PropertyType[]>([]);
  const [stars, setStars] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [sizeRange, setSizeRange] = useState("any");
  const [mealPlan, setMealPlan] = useState("any");
  const [sort, setSort] = useState("Выгодные сначала");
  const [saved, setSaved] = useState<Array<number | string>>([]);
  const [savedStays, setSavedStays] = useState<Stay[]>([]);
  const [photoIndices, setPhotoIndices] = useState<Record<string, number>>({});
  const [searched, setSearched] = useState(false);
  const [searching, setSearching] = useState(false);
  const [searchingMore, setSearchingMore] = useState(false);
  const [searchCursor, setSearchCursor] = useState<SearchCursor | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [datePicker, setDatePicker] = useState<"checkIn" | "checkOut" | null>(null);
  const [calendarMonth, setCalendarMonth] = useState(new Date(2026, 8, 1));
  const [authMode, setAuthMode] = useState<"login" | "register" | "account" | null>(null);
  const [signedIn, setSignedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>(initialHistory);
  const [liveStays, setLiveStays] = useState<Stay[]>([]);
  const [searchError, setSearchError] = useState("");
  const [agentOpen, setAgentOpen] = useState(false);
  const [agentInput, setAgentInput] = useState("");
  const [agentLoading, setAgentLoading] = useState(false);
  const [agentMessages, setAgentMessages] = useState<AgentMessage[]>([]);
  const [voiceListening, setVoiceListening] = useState(false);
  const [voiceError, setVoiceError] = useState("");
  const voiceRecognition = useRef<SpeechRecognitionLike | null>(null);
  const lastSearchRequest = useRef<SearchOverrides>({});
  const t = translations[language];
  const locale = language === "ru" ? "ru-RU" : language === "tr" ? "tr-TR" : "en-GB";
  const tripNights = useMemo(() => {
    if (!checkIn || !checkOut) return 1;
    const value = Math.round((parseIso(checkOut).getTime() - parseIso(checkIn).getTime()) / 86400000);
    return Math.max(1, value);
  }, [checkIn, checkOut]);

  useEffect(() => {
    const storedHistory = window.localStorage.getItem("mareva-history");
    const storedUser = window.localStorage.getItem("mareva-demo-user");
    const guestHistory = window.sessionStorage.getItem("mareva-guest-history");
    if (storedUser) {
      // Restoring browser-owned account state is intentionally a one-time mount action.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSignedIn(true);
      try {
        const user = JSON.parse(storedUser);
        setUserName(user.name ?? "Mareva");
        setUserEmail(user.email ?? "");
      } catch { setUserName("Mareva"); }
      const storedSaved = window.localStorage.getItem("mareva-account-saved");
      const storedSavedItems = window.localStorage.getItem("mareva-account-saved-items");
      if (storedSaved) setSaved(JSON.parse(storedSaved));
      if (storedSavedItems) setSavedStays(JSON.parse(storedSavedItems));
      if (storedHistory) setHistory(JSON.parse(storedHistory));
    } else {
      const sessionSaved = window.sessionStorage.getItem("mareva-guest-saved");
      const sessionSavedItems = window.sessionStorage.getItem("mareva-guest-saved-items");
      if (sessionSaved) setSaved(JSON.parse(sessionSaved));
      if (sessionSavedItems) setSavedStays(JSON.parse(sessionSavedItems));
      if (guestHistory) setHistory(JSON.parse(guestHistory));
    }
  }, []);

  useEffect(() => {
    void trackActivity("visit");
  }, []);

  const filtered = useMemo(() => {
    let items = liveStays.filter((stay) => {
      const cityOk = destination === "Вся Турция" || stay.city === destination;
      const typeOk = selectedTypes.length === 0 || selectedTypes.includes(stay.type);
      const sizeOk =
        sizeRange === "any" ||
        (sizeRange === "up-to-20" && stay.roomSize !== null && stay.roomSize <= 20) ||
        (sizeRange === "20-30" && stay.roomSize !== null && stay.roomSize >= 20 && stay.roomSize < 30) ||
        (sizeRange === "30-40" && stay.roomSize !== null && stay.roomSize >= 30 && stay.roomSize <= 40) ||
        (sizeRange === "over-40" && stay.roomSize !== null && stay.roomSize > 40);
      const mealOk = mealPlan === "any" || mealPlanOf(stay) === mealPlan;
      return cityOk && typeOk && stay.stars >= stars && stay.price / tripNights <= maxPrice && sizeOk && mealOk && stay.guests * rooms >= guests;
    });
    if (sort === "Сначала дешевле") items = [...items].sort((a, b) => a.price - b.price);
    if (sort === "По рейтингу") items = [...items].sort((a, b) => b.score - a.score);
    if (sort === "Выгодные сначала") items = [...items].sort((a, b) => (b.oldPrice - b.price) / b.oldPrice - (a.oldPrice - a.price) / a.oldPrice);
    return items;
  }, [destination, guests, liveStays, maxPrice, mealPlan, rooms, selectedTypes, sizeRange, sort, stars, tripNights]);

  async function runSearch(overrides: SearchOverrides = {}, append = false, cursor: SearchCursor | null = null) {
    const searchDestination = overrides.destination ?? destination;
    const searchHotelName = overrides.hotelName ?? hotelName;
    const searchCheckIn = overrides.checkIn ?? checkIn;
    const searchCheckOut = overrides.checkOut ?? checkOut;
    const searchGuests = overrides.guests ?? guests;
    const searchRooms = overrides.rooms ?? rooms;
    const searchPropertyTypes = overrides.propertyTypes ?? selectedTypes;
    const searchMaxPrice = overrides.maxPrice ?? maxPrice;
    const searchLanguage = overrides.language ?? language;
    if (!searchCheckIn || !searchCheckOut) {
      setDatePicker(searchCheckIn ? "checkOut" : "checkIn");
      return;
    }
    if (append) setSearchingMore(true);
    else setSearching(true);
    setSearchError("");
    if (!append) {
      setSearched(false);
      setSearchCursor(null);
      setPhotoIndices({});
      lastSearchRequest.current = { destination: searchDestination, hotelName: searchHotelName, checkIn: searchCheckIn, checkOut: searchCheckOut, guests: searchGuests, rooms: searchRooms, propertyTypes: searchPropertyTypes, maxPrice: searchMaxPrice, language: searchLanguage };
      void trackActivity("search", searchDestination);
    }
    try {
      const params = new URLSearchParams({ destination: searchDestination, checkIn: searchCheckIn, checkOut: searchCheckOut, guests: String(searchGuests), rooms: String(searchRooms), maxPrice: String(searchMaxPrice), language: searchLanguage });
      if (searchHotelName) params.set("hotelName", searchHotelName);
      if (searchPropertyTypes.length > 0) params.set("propertyTypes", searchPropertyTypes.join(","));
      if (cursor?.pageToken) params.set("pageToken", cursor.pageToken);
      if (cursor?.offset) params.set("offset", String(cursor.offset));
      if (cursor?.scopeIndex) params.set("scopeIndex", String(cursor.scopeIndex));
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 22000);
      const response = await fetch(`/api/hotels/search?${params.toString()}`, { signal: controller.signal })
        .finally(() => window.clearTimeout(timeout));
      const payload = await response.json() as { offers?: Stay[]; nextCursor?: SearchCursor | null; error?: string; message?: string };
      if (!response.ok) throw new Error(payload.error === "SOURCE_NOT_CONFIGURED" ? t.sourceMissing : payload.message || t.noMatches);
      const incoming = payload.offers || [];
      const fallbackOffers = !append && incoming.length === 0
        ? demoOffersForSearch({
          destination: searchDestination,
          hotelName: searchHotelName,
          guests: searchGuests,
          rooms: searchRooms,
          propertyTypes: searchPropertyTypes,
          maxPrice: searchMaxPrice,
          nights: tripNights,
        })
        : [];
      const nextOffers = incoming.length > 0 ? incoming : fallbackOffers;
      setLiveStays((current) => append
        ? Array.from(new Map([...current, ...nextOffers].map((stay) => [stay.id, stay])).values())
        : nextOffers);
      setSearchCursor(incoming.length > 0 ? payload.nextCursor || null : null);
      if (!append) {
        const item: HistoryItem = {
          id: crypto.randomUUID(), kind: "search", destination: searchDestination,
          dates: `${searchCheckIn.split("-").reverse().slice(0, 2).join(".")}–${searchCheckOut.split("-").reverse().join(".")}`,
          guests: searchGuests,
        };
        setHistory((current) => {
          const next = [item, ...current].slice(0, 10);
          const storage = signedIn ? window.localStorage : window.sessionStorage;
          storage.setItem(signedIn ? "mareva-history" : "mareva-guest-history", JSON.stringify(next));
          return next;
        });
      }
      setSearched(true);
      if (!append) document.getElementById("results")?.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (error) {
      if (!append) {
        const fallbackOffers = demoOffersForSearch({
          destination: searchDestination,
          hotelName: searchHotelName,
          guests: searchGuests,
          rooms: searchRooms,
          propertyTypes: searchPropertyTypes,
          maxPrice: searchMaxPrice,
          nights: tripNights,
        });
        setLiveStays(fallbackOffers);
        setSearchCursor(null);
        const message = error instanceof Error && error.name === "AbortError"
          ? "Поиск занял слишком много времени. Попробуйте ещё раз или уточните направление."
          : error instanceof Error ? error.message : t.noMatches;
        setSearchError(fallbackOffers.length > 0 ? "" : message);
      }
      setSearched(true);
      if (append) setSearchError(error instanceof Error ? error.message : t.noMatches);
    } finally {
      if (append) setSearchingMore(false);
      else setSearching(false);
    }
  }

  function loadMoreOffers() {
    if (!searchCursor || searchingMore) return;
    void runSearch(lastSearchRequest.current, true, searchCursor);
  }

  async function sendAgentMessage(message: string, autoApply = false) {
    if (!message || agentLoading) return;
    setAgentInput("");
    setAgentMessages((current) => [...current, { id: crypto.randomUUID(), role: "user", text: message }]);
    setAgentLoading(true);
    try {
      const response = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          language,
          current: { destination, hotelName, checkIn, checkOut, guests, rooms, propertyTypes: selectedTypes, stars, maxPrice, sizeRange, mealPlan },
        }),
      });
      const payload = await response.json() as { reply?: string; filters?: AgentFilters; error?: string };
      if (!response.ok) throw new Error(payload.error || "AGENT_ERROR");
      setAgentMessages((current) => [...current, { id: crypto.randomUUID(), role: "assistant", text: payload.reply || t.aiIntro, filters: payload.filters || {} }]);
      if (autoApply && payload.filters && Object.keys(payload.filters).length > 0) applyAgentFilters(payload.filters);
    } catch {
      const fallbackFilters = parseLocalAgentFilters(message);
      if (Object.keys(fallbackFilters).length > 0) {
        setAgentMessages((current) => [...current, { id: crypto.randomUUID(), role: "assistant", text: localAgentFallbackReply(language), filters: fallbackFilters }]);
        if (autoApply) applyAgentFilters(fallbackFilters);
      } else {
        setAgentMessages((current) => [...current, { id: crypto.randomUUID(), role: "assistant", text: t.aiError }]);
      }
    } finally {
      setAgentLoading(false);
    }
  }

  async function askAgent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await sendAgentMessage(agentInput.trim());
  }

  function startVoiceSearch() {
    if (voiceListening) {
      voiceRecognition.current?.stop();
      return;
    }
    const speechWindow = window as typeof window & {
      SpeechRecognition?: SpeechRecognitionConstructor;
      webkitSpeechRecognition?: SpeechRecognitionConstructor;
    };
    const Recognition = speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;
    if (!Recognition) {
      setAgentOpen(true);
      setVoiceError(t.voiceUnavailable);
      return;
    }

    const recognition = new Recognition();
    voiceRecognition.current = recognition;
    recognition.lang = language === "ru" ? "ru-RU" : language === "tr" ? "tr-TR" : "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onstart = () => {
      setAgentOpen(true);
      setVoiceError("");
      setVoiceListening(true);
    };
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript?.trim() || "";
      setAgentInput(transcript);
      if (transcript) {
        const localFilters = parseLocalAgentFilters(transcript);
        if (Object.keys(localFilters).length > 0) {
          setAgentMessages((current) => [
            ...current,
            { id: crypto.randomUUID(), role: "user", text: transcript },
            { id: crypto.randomUUID(), role: "assistant", text: localAgentFallbackReply(language), filters: localFilters },
          ]);
          applyAgentFilters(localFilters);
        } else {
          void sendAgentMessage(transcript, true);
        }
      }
    };
    recognition.onerror = () => setVoiceError(t.voiceUnavailable);
    recognition.onend = () => {
      setVoiceListening(false);
      voiceRecognition.current = null;
    };
    recognition.start();
  }

  function applyAgentFilters(filters: AgentFilters) {
    const nextDestination = filters.destination ?? destination;
    const nextHotelName = filters.hotelName ?? hotelName;
    const nextCheckIn = filters.checkIn ?? checkIn;
    const nextCheckOut = filters.checkOut ?? checkOut;
    const nextGuests = filters.guests ?? guests;
    const nextRooms = filters.rooms ?? rooms;
    const nextPropertyTypes = filters.propertyTypes ?? (filters.propertyType && filters.propertyType !== "Все варианты" ? [filters.propertyType] : selectedTypes);
    const nextMaxPrice = filters.maxPrice ?? maxPrice;
    setDestination(nextDestination);
    setHotelName(nextHotelName);
    setCheckIn(nextCheckIn);
    setCheckOut(nextCheckOut);
    setGuests(nextGuests);
    setRooms(nextRooms);
    if (filters.propertyTypes || filters.propertyType) setSelectedTypes(nextPropertyTypes);
    if (filters.stars !== undefined) setStars(filters.stars);
    if (filters.maxPrice !== undefined) setMaxPrice(filters.maxPrice);
    if (filters.sizeRange) setSizeRange(filters.sizeRange);
    if (filters.mealPlan) setMealPlan(filters.mealPlan);
    setAgentMessages((current) => [...current, { id: crypto.randomUUID(), role: "assistant", text: t.aiApplied }]);
    setAgentOpen(false);
    void runSearch({ destination: nextDestination, hotelName: nextHotelName, checkIn: nextCheckIn, checkOut: nextCheckOut, guests: nextGuests, rooms: nextRooms, propertyTypes: nextPropertyTypes, maxPrice: nextMaxPrice });
  }

  function agentFilterLabels(filters: AgentFilters) {
    const labels: string[] = [];
    if (filters.destination) labels.push(destinationNames[language][filters.destination] || filters.destination);
    if (filters.hotelName) labels.push(`${t.hotelNameLabel}: ${filters.hotelName}`);
    if (filters.checkIn) labels.push(`${t.checkIn}: ${displayDate(filters.checkIn)}`);
    if (filters.checkOut) labels.push(`${t.checkOut}: ${displayDate(filters.checkOut)}`);
    if (filters.guests) labels.push(`${filters.guests} · ${t.guests}`);
    if (filters.rooms) labels.push(`${filters.rooms} · ${t.rooms.toLocaleLowerCase()}`);
    if (filters.propertyTypes?.length) labels.push(filters.propertyTypes.map((item) => item === "Отель" ? t.hotel : item === "Апарт-отель" ? t.apart : t.villa).join(" + "));
    else if (filters.propertyType) labels.push(filters.propertyType === "Отель" ? t.hotel : filters.propertyType === "Апарт-отель" ? t.apart : filters.propertyType === "Вилла" ? t.villa : t.allTypes);
    if (filters.stars) labels.push(`${filters.stars}★`);
    if (filters.maxPrice) labels.push(`≤ €${filters.maxPrice.toLocaleString(locale)} · ${t.perNight}`);
    if (filters.sizeRange) labels.push({ any: t.anyArea, "up-to-20": t.up20, "20-30": t.from20, "30-40": t.from30, "over-40": t.over40 }[filters.sizeRange]);
    if (filters.mealPlan) labels.push({ any: t.anyMeal, "no-meals": t.noMeal, breakfast: t.breakfast, "half-board": t.halfBoard, "full-board": t.fullBoard, "all-inclusive": t.allInclusive }[filters.mealPlan]);
    return labels;
  }

  function toggleSaved(stay: Stay) {
    const id = stay.id;
    setSaved((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      const storage = signedIn ? window.localStorage : window.sessionStorage;
      storage.setItem(signedIn ? "mareva-account-saved" : "mareva-guest-saved", JSON.stringify(next));
      return next;
    });
    setSavedStays((current) => {
      const next = current.some((item) => item.id === id) ? current.filter((item) => item.id !== id) : [stay, ...current];
      const storage = signedIn ? window.localStorage : window.sessionStorage;
      storage.setItem(signedIn ? "mareva-account-saved-items" : "mareva-guest-saved-items", JSON.stringify(next));
      return next;
    });
  }

  function movePhoto(stay: Stay, direction: -1 | 1) {
    const photos = stay.images?.length ? stay.images : [stay.image || "/hero-istanbul.png"];
    if (photos.length < 2) return;
    const key = String(stay.id);
    setPhotoIndices((current) => ({
      ...current,
      [key]: ((current[key] || 0) + direction + photos.length) % photos.length,
    }));
  }

  function displayDate(value: string) {
    return value ? new Intl.DateTimeFormat(locale, { day: "numeric", month: "long" }).format(parseIso(value)) : t.selectDates;
  }

  const calendarMonths = useMemo(() => Array.from({ length: 12 }, (_, month) => new Intl.DateTimeFormat(locale, { month: "long" }).format(new Date(calendarMonth.getFullYear(), month, 1))), [calendarMonth, locale]);

  function moveCalendar(direction: -1 | 1) {
    const next = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + direction, 1);
    if (next.getFullYear() < 2026 || next.getFullYear() > 2027) return;
    setCalendarMonth(next);
  }

  function selectDate(value: Date) {
    const selectedIso = toIso(value);
    if (selectedIso === checkIn || selectedIso === checkOut) {
      setCheckIn("");
      setCheckOut("");
      setDatePicker("checkIn");
      return;
    }
    if (datePicker === "checkIn") {
      setCheckIn(selectedIso);
      if (!checkOut || value.getTime() >= parseIso(checkOut).getTime()) {
        const next = new Date(value);
        next.setDate(next.getDate() + 1);
        setCheckOut(toIso(next));
      }
      setDatePicker("checkOut");
      return;
    }
    if (!checkIn || value.getTime() <= parseIso(checkIn).getTime()) {
      setCheckIn(selectedIso);
      setCheckOut("");
      setDatePicker("checkOut");
      return;
    }
    setCheckOut(selectedIso);
  }

  function clearDates() {
    setCheckIn("");
    setCheckOut("");
    setDatePicker("checkIn");
  }

  function submitAuth(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") || "Mareva");
    const patronymic = String(data.get("patronymic") || "");
    const email = String(data.get("email") || "");
    const fullName = [name, patronymic].filter(Boolean).join(" ");
    window.localStorage.setItem("mareva-demo-user", JSON.stringify({ name: fullName, email }));
    window.localStorage.setItem("mareva-account-saved", JSON.stringify(saved));
    window.localStorage.setItem("mareva-account-saved-items", JSON.stringify(savedStays));
    window.localStorage.setItem("mareva-history", JSON.stringify(history.slice(0, 10)));
    setUserName(fullName);
    setUserEmail(email);
    setSignedIn(true);
    setAuthMode("account");
  }

  function signOut() {
    window.localStorage.removeItem("mareva-demo-user");
    setSignedIn(false);
    setUserName("");
    setUserEmail("");
    const sessionSaved = window.sessionStorage.getItem("mareva-guest-saved");
    const sessionSavedItems = window.sessionStorage.getItem("mareva-guest-saved-items");
    setSaved(sessionSaved ? JSON.parse(sessionSaved) : []);
    setSavedStays(sessionSavedItems ? JSON.parse(sessionSavedItems) : []);
    setAuthMode(null);
  }

  function togglePropertyType(value: PropertyType) {
    setSelectedTypes((current) => current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);
  }

  return (
    <main aria-busy={searching}>
      {searching && (
        <div className="search-loading-overlay" role="status" aria-live="polite" aria-label={t.searchTitle}>
          <div className="search-loading-card">
            <div className="search-loading-mark" aria-hidden="true"><span /><span /><b>m</b></div>
            <span className="search-loading-kicker">Mareva · live search</span>
            <h2>{t.searchTitle}</h2>
            <p>{t.searchDetail}</p>
            <div className="search-loading-query">
              <strong>{destinationNames[language][destination] || destination}</strong>
              {hotelName && <span>{hotelName}</span>}
              <span>{displayDate(checkIn)} — {displayDate(checkOut)}</span>
              <span>{guests} · {t.guests.toLocaleLowerCase()} · {rooms} · {t.rooms.toLocaleLowerCase()}</span>
            </div>
            <div className="search-loading-progress" aria-hidden="true"><i /></div>
          </div>
        </div>
      )}
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Mareva — на главную">
          <img className="brand-icon" src="/favicon.png" alt="" />
          <span>mareva</span>
        </a>
        <nav aria-label="Главное меню">
          <a href="#results">{t.findStay}</a>
          <a href="#how">{t.how}</a>
          <button className="saved-link" type="button" onClick={() => setAuthMode("account")}>{t.favorites} <span>{saved.length}</span></button>
        </nav>
        <div className="header-actions">
          <div className="language-switch" aria-label="Language">
            {(["ru", "en", "tr"] as Language[]).map((item) => <button type="button" className={language === item ? "active" : ""} onClick={() => setLanguage(item)} key={item}>{item.toUpperCase()}</button>)}
          </div>
          {signedIn ? (
            <button className="account-button" type="button" onClick={() => setAuthMode("account")}><img src="/favicon.png" alt="" />{userName.split(" ")[0] || t.account}</button>
          ) : (
            <div className="auth-actions"><button type="button" onClick={() => setAuthMode("login")}>{t.login}</button><button className="register-button" type="button" onClick={() => setAuthMode("register")}>{t.register}</button></div>
          )}
          <a className="crowns-partner" href="https://the-crowns-alexstone.ru/" aria-label="Партнёры: The Crowns">
            <img src="/the-crowns-icon.png" alt="" aria-hidden="true" />
            <span>
              <small>Партнёры</small>
              <em>The</em>
              <strong>Crowns</strong>
            </span>
          </a>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="eyebrow"><span className="live-dot" /> {t.eyebrow}</div>
        <h1>{t.heroA}<br/><em>{t.heroB}</em></h1>
        <p className="hero-copy">{t.heroCopy}</p>
        <div className="hero-promise">{t.heroPromise}</div>

        <div className="search-shell">
        <div className="search-panel" aria-label={t.findStay}>
          <label className="search-field destination-field">
            <span>{t.where}</span>
            <select value={destination} onChange={(event) => setDestination(event.target.value)}>
              {destinations.map((item) => <option value={item} key={item}>{destinationNames[language][item]}</option>)}
            </select>
          </label>
          <label className="search-field hotel-name-field">
            <span>{t.hotelSearch}</span>
            <input type="search" value={hotelName} onChange={(event) => setHotelName(event.target.value)} placeholder={t.hotelPlaceholder} maxLength={120} autoComplete="off" />
          </label>
          <div className="search-field date-field check-in-field">
            <span>{t.checkIn}</span>
            <button type="button" onClick={() => { setDatePicker("checkIn"); if (checkIn) setCalendarMonth(new Date(parseIso(checkIn).getFullYear(), parseIso(checkIn).getMonth(), 1)); }}>{displayDate(checkIn)} <b>⌄</b></button>
          </div>
          <div className="search-field date-field check-out-field">
            <span>{t.checkOut}</span>
            <button type="button" onClick={() => { setDatePicker(checkIn ? "checkOut" : "checkIn"); if (checkOut) setCalendarMonth(new Date(parseIso(checkOut).getFullYear(), parseIso(checkOut).getMonth(), 1)); }}>{displayDate(checkOut)} <b>⌄</b></button>
          </div>
          <label className="search-field guest-field">
            <span>{t.guests}</span>
            <select value={guests} onChange={(event) => setGuests(Number(event.target.value))}>
              {Array.from({ length: 10 }, (_, index) => index + 1).map((item) => (
                <option value={item} key={item}>
                  {item} {guestLabel(item, language)}
                </option>
              ))}
            </select>
          </label>
          <label className="search-field rooms-field">
            <span>{t.rooms}</span>
            <select value={rooms} onChange={(event) => setRooms(Number(event.target.value))}>
              {Array.from({ length: 8 }, (_, index) => index + 1).map((item) => (
                <option value={item} key={item}>
                  {item} {roomLabel(item, language)}
                </option>
              ))}
            </select>
          </label>
          <div className="search-actions">
            <button className="search-button" onClick={() => void runSearch()} disabled={searching || !checkIn || !checkOut}>
              {searching ? t.searching : t.find}<span aria-hidden="true">→</span>
            </button>
            <button className={`voice-search-button ${voiceListening ? "listening" : ""}`} type="button" onClick={startVoiceSearch} disabled={agentLoading || searching} aria-label={voiceListening ? t.voiceListening : t.voiceSearch} title={voiceListening ? t.voiceListening : t.voiceSearch}>
              <span className="mic-icon" aria-hidden="true"><i /></span>
            </button>
          </div>
        </div>
        </div>
        {datePicker && <div className="calendar-overlay" role="presentation" onMouseDown={(event) => { if (event.currentTarget === event.target) setDatePicker(null); }}>
          <div className="calendar-modal" role="dialog" aria-modal="true" aria-label={t.selectDates}>
            <div className="calendar-head">
              <div className="calendar-title"><strong>{t.selectDates}</strong><span>{datePicker === "checkIn" ? t.chooseArrival : t.chooseDeparture}</span></div>
              <div className="calendar-head-actions"><button type="button" className="calendar-close" aria-label={t.close} onClick={() => setDatePicker(null)}>×</button></div>
            </div>

            <div className="calendar-date-tabs" role="tablist" aria-label={t.selectDates}>
              <button type="button" role="tab" aria-selected={datePicker === "checkIn"} className={datePicker === "checkIn" ? "active" : ""} onClick={() => { setDatePicker("checkIn"); if (checkIn) setCalendarMonth(new Date(parseIso(checkIn).getFullYear(), parseIso(checkIn).getMonth(), 1)); }}><span>{t.checkIn}</span><strong>{displayDate(checkIn)}</strong></button>
              <button type="button" role="tab" aria-selected={datePicker === "checkOut"} className={datePicker === "checkOut" ? "active" : ""} onClick={() => { setDatePicker(checkIn ? "checkOut" : "checkIn"); if (checkOut) setCalendarMonth(new Date(parseIso(checkOut).getFullYear(), parseIso(checkOut).getMonth(), 1)); }}><span>{t.checkOut}</span><strong>{displayDate(checkOut)}</strong></button>
            </div>

            <div className="calendar-year-row">
              <span>{t.year}</span>
              {[2026, 2027].map((year) => <button type="button" key={year} className={calendarMonth.getFullYear() === year ? "active" : ""} onClick={() => setCalendarMonth(new Date(year, calendarMonth.getMonth(), 1))}>{year}</button>)}
            </div>

            <div className="calendar-month-rail" aria-label={t.selectDates}>
              {calendarMonths.map((month, index) => <button type="button" key={month} className={calendarMonth.getMonth() === index ? "active" : ""} onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), index, 1))}>{month}</button>)}
            </div>

            <div className="calendar-main">
              <button type="button" className="calendar-arrow" aria-label={t.previousMonth} disabled={calendarMonth.getFullYear() === 2026 && calendarMonth.getMonth() === 0} onClick={() => moveCalendar(-1)}>←</button>
              <CalendarMonth month={calendarMonth} language={language} checkIn={checkIn} checkOut={checkOut} onPick={selectDate} />
              <button type="button" className="calendar-arrow" aria-label={t.nextMonth} disabled={calendarMonth.getFullYear() === 2027 && calendarMonth.getMonth() === 11} onClick={() => moveCalendar(1)}>→</button>
            </div>

            <div className="calendar-footer"><button type="button" className="calendar-clear" onClick={clearDates} disabled={!checkIn && !checkOut}>{t.clearDates}</button><button type="button" className="calendar-next" onClick={() => setDatePicker(null)} disabled={!checkIn || !checkOut}>{t.dateNext}<span aria-hidden="true">→</span></button></div>

          </div>
        </div>}
        <div className="popular">{t.popular} {["Анталья", "Сиде", "Кемер", "Бодрум", "Мармарис", "Фетхие"].map((item) => <button key={item} type="button" aria-pressed={destination === item} className={destination === item ? "active" : ""} onClick={() => setDestination(item)}>{destinationNames[language][item]}</button>)}</div>

      </section>

      <section className="trust-strip" aria-label="Преимущества">
        {t.benefits.map(([title, text], index) => <div className={index === 3 ? "demo-note" : ""} key={title}><strong>{title}</strong><span>{text}</span></div>)}
      </section>

      <section className="results-section" id="results">
        <div className="results-heading">
          <div>
            <span className="section-kicker">{t.picked}</span>
            <h2>{destination === "Вся Турция" ? t.allTurkey : `${t.housing}: ${destinationNames[language][destination]}`}</h2>
            <p>{filtered.length} {t.variants} · {checkIn && checkOut ? `${checkIn.split("-").reverse().join(".")} — ${checkOut.split("-").reverse().join(".")}` : t.selectDates}</p>
          </div>
          <div className="heading-actions">
            <button className="filter-mobile" onClick={() => setFiltersOpen(!filtersOpen)}>{t.filters}</button>
            <label className="sort-label">{t.sort}
              <select value={sort} onChange={(event) => setSort(event.target.value)}>
                <option value="Выгодные сначала">{t.sortDeal}</option>
                <option value="Сначала дешевле">{t.sortCheap}</option>
                <option value="По рейтингу">{t.sortRating}</option>
              </select>
            </label>
          </div>
        </div>

        {searched && !searchError && (
          <div className="search-status">
            <span className="status-icon">✓</span>
            <div><strong>{t.requestReady}</strong><span>{t.requestText}</span></div>
            <button onClick={() => setSearched(false)} aria-label="Закрыть уведомление">×</button>
          </div>
        )}

        <div className="catalog-layout">
          <aside className={filtersOpen ? "filters open" : "filters"}>
            <div className="filter-title"><strong>{t.filters}</strong><button onClick={() => { setSelectedTypes([]); setStars(0); setMaxPrice(10000); setSizeRange("any"); setMealPlan("any"); }}>{t.reset}</button></div>
            <fieldset>
              <legend>{t.type}</legend>
              <div className="type-choice-grid" role="group" aria-label={t.type}>
                <button type="button" className={selectedTypes.length === 0 ? "active" : ""} onClick={() => setSelectedTypes([])}>{t.allTypes}</button>
                {([["Отель", t.hotel], ["Вилла", t.villa], ["Апарт-отель", t.apart]] as Array<[PropertyType, string]>).map(([value, label]) => (
                  <button type="button" key={value} className={selectedTypes.includes(value) ? "active" : ""} aria-pressed={selectedTypes.includes(value)} onClick={() => togglePropertyType(value)}>
                    {label}
                  </button>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend>{t.category}</legend>
              <div className="star-filter">
                {[0, 3, 4, 5].map((item) => <button className={stars === item ? "active" : ""} onClick={() => setStars(item)} key={item}>{item === 0 ? t.all : `${item}★`}</button>)}
              </div>
            </fieldset>
            <fieldset>
              <legend>{t.area}</legend>
              <select value={sizeRange} onChange={(event) => setSizeRange(event.target.value)}>
                <option value="any">{t.anyArea}</option>
                <option value="up-to-20">{t.up20}</option>
                <option value="20-30">{t.from20}</option>
                <option value="30-40">{t.from30}</option>
                <option value="over-40">{t.over40}</option>
              </select>
            </fieldset>
            <fieldset>
              <legend>{t.meal}</legend>
              <select value={mealPlan} onChange={(event) => setMealPlan(event.target.value)}>
                <option value="any">{t.anyMeal}</option>
                <option value="no-meals">{t.noMeal}</option>
                <option value="breakfast">{t.breakfast}</option>
                <option value="half-board">{t.halfBoard}</option>
                <option value="full-board">{t.fullBoard}</option>
                <option value="all-inclusive">{t.allInclusive}</option>
              </select>
            </fieldset>
            <fieldset>
              <legend>{t.price}</legend>
              <div className="range-value">{t.upTo} €{maxPrice.toLocaleString(locale)}</div>
              <input className="range" type="range" min="400" max="10000" step="100" value={maxPrice} onChange={(event) => setMaxPrice(Number(event.target.value))} aria-label={`${t.price}: ${t.upTo} €${maxPrice.toLocaleString(locale)}`} />
              <div className="range-labels"><span>€400</span><span>€10 000</span></div>
            </fieldset>
            <div className="source-card"><span>WEB</span><strong>{t.webTitle}</strong><p>{t.webText}</p></div>
          </aside>

          <div className="results-list">
            {!searched && <div className="empty-state live-intro"><span>⌁</span><h3>{t.startLive}</h3><p>{t.requestText}</p></div>}
            {searched && filtered.length === 0 && (
              <div className="empty-state"><span>⌁</span><h3>{searchError || t.noMatches}</h3><p>{searchError ? t.sourceMissing : t.expand}</p><button onClick={() => { setDestination("Вся Турция"); setMaxPrice(10000); setSizeRange("any"); setMealPlan("any"); }}>{t.showTurkey}</button></div>
            )}
            {filtered.map((stay) => {
              const discount = stay.discount ?? Math.round((1 - stay.price / stay.oldPrice) * 100);
              const hasDiscount = discount > 0;
              const photos = stay.images?.length ? stay.images : [stay.image || "/hero-istanbul.png"];
              const photoIndex = Math.min(photoIndices[String(stay.id)] || 0, photos.length - 1);
              return (
                <article className={hasDiscount ? "hotel-card" : "hotel-card regular-hotel-card"} key={stay.id}>
                  <div className="hotel-image-wrap">
                    <img className="hotel-image" src={photos[photoIndex]} alt={`${stay.name}, ${stay.city} — ${photoIndex + 1}`} />
                    <span className={hasDiscount ? "deal-badge" : "deal-badge regular-badge"}>{hasDiscount ? `−${discount}% ${t.deal}` : t.regularOption}</span>
                    <button className={`heart ${saved.includes(stay.id) ? "saved" : ""}`} onClick={() => toggleSaved(stay)} aria-label={saved.includes(stay.id) ? "Удалить из избранного" : "Добавить в избранное"}>{saved.includes(stay.id) ? "♥" : "♡"}</button>
                    {photos.length > 1 && <>
                      <button className="photo-arrow previous" type="button" onClick={() => movePhoto(stay, -1)} aria-label={t.previousPhoto}>‹</button>
                      <button className="photo-arrow next" type="button" onClick={() => movePhoto(stay, 1)} aria-label={t.nextPhoto}>›</button>
                    </>}
                    <span className="photo-count">{photoIndex + 1} / {photos.length}</span>
                  </div>
                  <div className="hotel-content">
                    <div className="hotel-topline"><span>{stay.type === "Отель" ? t.hotel : stay.type === "Апарт-отель" ? t.apart : t.villa}</span><Stars count={stay.stars} /></div>
                    <h3>{stay.name}</h3>
                    <p className="location">{stay.area}, {destinationNames[language][stay.city]} · {stay.distance}</p>
                    <div className="rating-row"><strong>{stay.score}</strong><span>{t.excellent}<br/><small>{stay.reviews} {t.reviews}</small></span></div>
                    <div className="room-line"><strong>{stay.roomSize ? `${stay.roomSize} м²` : t.sizeAtSource} · {t.upToGuests} {stay.guests} {t.guestWord}</strong><span>{stay.feature}</span></div>
                    <div className="tag-row">{stay.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                    <div className="price-row">
                      <div>{hasDiscount && <span className="old-price">€{stay.oldPrice.toLocaleString(locale)} · {t.officialPrice}</span>}<strong>€{stay.price.toLocaleString(locale)}</strong><small>{stay.live ? `€${Math.round(stay.price / tripNights).toLocaleString(locale)} ${t.perNight} · ${t.totalStay} · ${stay.feature} · ${t.checkedNow}` : t.demoPrice}</small></div>
                      <a className="check-button" href={stay.link || outboundUrl(stay, destination)} target="_blank" rel="noreferrer" onClick={() => void trackActivity("outbound", stay.city)}>{t.checkWeb} <span>↗</span></a>
                    </div>
                  </div>
                </article>
              );
            })}
            {searched && searchError && liveStays.length > 0 && <p className="load-more-error" role="alert">{searchError}</p>}
            {searched && searchCursor && (
              <div className="load-more-wrap">
                <button type="button" onClick={loadMoreOffers} disabled={searchingMore}>
                  {searchingMore ? t.loadingMore : t.showMore}<span aria-hidden="true">↓</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="how-section" id="how">
        <div className="how-intro"><span className="section-kicker">{t.howKicker}</span><h2>{t.howA}<br/>{t.howB}</h2><p>{t.howCopy}</p></div>
        <ol className="steps">
          {t.steps.map(([title, text], index) => <li key={title}><span>0{index + 1}</span><div><strong>{title}</strong><p>{text}</p></div></li>)}
        </ol>
      </section>

      <section className="roadmap">
        <div><span className="section-kicker">{t.roadmapKicker}</span><h2>{t.roadmapA}<br/>{t.roadmapB}</h2></div>
        <div className="roadmap-track">
          {t.roadmap.map(([stage, title, text], index) => <div className={`roadmap-item ${index === 0 ? "active" : ""}`} key={stage}><span>{stage}</span><strong>{title}</strong><p>{text}</p></div>)}
        </div>
      </section>

      <footer>
        <a className="brand footer-brand" href="#top"><img className="brand-icon" src="/favicon.png" alt="" /><span>mareva</span></a>
        <p>{t.footerText}</p>
        <div><a href="#how">{t.howSearch}</a><a href="#results">{t.catalog}</a><span>{language.toUpperCase()} · EUR</span></div>
      </footer>

      <button className={`ai-launcher ${agentOpen ? "open" : ""}`} type="button" onClick={() => setAgentOpen((current) => !current)} aria-expanded={agentOpen} aria-controls="mareva-ai-panel">
        <span className="ai-launcher-orb" aria-hidden="true">✦</span>
        <span><strong>{t.aiName}</strong><small>{t.aiIntro}</small></span>
      </button>

      {agentOpen && (
        <section className="ai-panel" id="mareva-ai-panel" role="dialog" aria-label={t.aiName}>
          <header className="ai-panel-head">
            <span className="ai-head-orb" aria-hidden="true">✦</span>
            <div><strong>{t.aiName}</strong><span>{t.aiBadge}</span></div>
            <button type="button" onClick={() => setAgentOpen(false)} aria-label={t.aiClose}>×</button>
          </header>
          <div className="ai-messages" aria-live="polite">
            <div className="ai-message assistant"><p>{t.aiIntro}</p></div>
            {agentMessages.map((message) => {
              const labels = message.filters ? agentFilterLabels(message.filters) : [];
              return (
                <div className={`ai-message ${message.role}`} key={message.id}>
                  <p>{message.text}</p>
                  {labels.length > 0 && <div className="ai-filter-chips">{labels.map((label) => <span key={label}>{label}</span>)}</div>}
                  {message.role === "assistant" && message.filters && labels.length > 0 && <button className="ai-apply" type="button" onClick={() => applyAgentFilters(message.filters!)}>{t.aiApply}<span>→</span></button>}
                </div>
              );
            })}
            {agentLoading && <div className="ai-message assistant thinking"><span /><span /><span /><small>{t.aiThinking}</small></div>}
          </div>
          {agentMessages.length === 0 && <div className="ai-suggestions">{t.aiExamples.map((example) => <button type="button" key={example} onClick={() => setAgentInput(example)}>{example}</button>)}</div>}
          {voiceError && <p className="voice-error" role="alert">{voiceError}</p>}
          <form className="ai-form" onSubmit={askAgent}>
            <label className="sr-only" htmlFor="mareva-ai-input">{t.aiPlaceholder}</label>
            <textarea id="mareva-ai-input" rows={2} value={agentInput} onChange={(event) => setAgentInput(event.target.value)} placeholder={t.aiPlaceholder} disabled={agentLoading} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); event.currentTarget.form?.requestSubmit(); } }} />
            <button className={`ai-voice-button ${voiceListening ? "listening" : ""}`} type="button" onClick={startVoiceSearch} disabled={agentLoading} aria-label={voiceListening ? t.voiceListening : t.voiceSearch} title={voiceListening ? t.voiceListening : t.voiceSearch}><span className="mic-icon" aria-hidden="true"><i /></span></button>
            <button className="ai-send-button" type="submit" disabled={!agentInput.trim() || agentLoading} aria-label={t.aiSend}>↑</button>
          </form>
        </section>
      )}

      {authMode && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setAuthMode(null); }}>
        <section className={`account-modal ${authMode === "account" ? "wide" : ""}`} role="dialog" aria-modal="true" aria-label={authMode === "account" ? t.profileTitle : authMode === "register" ? t.registerTitle : t.loginTitle}>
          <button className="modal-close" type="button" onClick={() => setAuthMode(null)} aria-label="Close">×</button>
          {authMode !== "account" ? <>
            <img className="auth-icon" src="/mareva-icon.png" alt="" />
            <span className="section-kicker">mareva</span>
            <h2>{authMode === "register" ? t.registerTitle : t.loginTitle}</h2>
            <p className="auth-note">{t.authNote}</p>
            <form className="auth-form" onSubmit={submitAuth}>
              <label>{t.name}<input name="name" required autoComplete="given-name" placeholder={language === "ru" ? "Алексей" : language === "tr" ? "Adınız" : "Your name"} /></label>
              {authMode === "register" && <label>{t.patronymic} <small>{t.optional}</small><input name="patronymic" autoComplete="additional-name" /></label>}
              <label>{t.email} <small>{t.optional}</small><input name="email" type="email" autoComplete="email" placeholder="name@example.com" /></label>
              <button type="submit">{authMode === "register" ? t.create : t.continue} <span>→</span></button>
            </form>
          </> : <>
            <div className="account-identity"><img src="/mareva-icon.png" alt="" /><div><span>{signedIn ? t.profileTitle : t.favorites}</span><h2>{signedIn ? userName : t.favoritesTitle}</h2>{signedIn && userEmail && <p>{userEmail}</p>}</div>{signedIn && <button type="button" onClick={signOut}>{t.logout}</button>}</div>
            {!signedIn && <div className="guest-account-note"><p>{t.guestNote}</p><button type="button" onClick={() => setAuthMode("register")}>{t.keepFavorites}</button></div>}
            <div className="account-columns">
              <div className="account-section"><div className="account-section-head"><h3>{t.favoritesTitle}</h3><span>{saved.length}</span></div>
                <div className="favorite-list">{savedStays.length ? savedStays.map((stay) => <a href={stay.link || outboundUrl(stay, stay.city)} target="_blank" rel="noreferrer" key={stay.id}><img src={stay.image || "/hero-istanbul.png"} alt="" /><span><strong>{stay.name}</strong><small>{destinationNames[language][stay.city] || stay.city} · −{stay.discount ?? Math.round((1 - stay.price / stay.oldPrice) * 100)}%</small></span><b>↗</b></a>) : <p className="empty-account">{t.noFavorites}</p>}</div>
              </div>
              <div className="account-section"><div className="account-section-head"><h3>{t.recent}</h3><span>{history.slice(0, 10).length}</span></div>
                <div className="history-list">{history.slice(0, 10).map((item) => <button type="button" key={item.id} onClick={() => { setDestination(item.destination); setGuests(item.guests); setAuthMode(null); }}><span className={`history-kind ${item.kind}`}>{item.kind === "booking" ? t.booking : t.search}</span><span><strong>{destinationNames[language][item.destination]}</strong><small>{item.dates} · {item.guests}</small></span><b>{t.repeat} →</b></button>)}</div>
              </div>
            </div>
            {signedIn && <p className="account-local-note">{t.localOnly}</p>}
          </>}
        </section>
      </div>}
    </main>
  );
}
