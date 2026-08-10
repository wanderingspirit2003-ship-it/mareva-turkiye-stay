"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Stay = {
  id: number | string;
  name: string;
  city: string;
  area: string;
  type: "Отель" | "Апарт-отель" | "Вилла";
  stars: number;
  score: number;
  reviews: number;
  roomSize: number | null;
  guests: number;
  price: number;
  oldPrice: number;
  image: string;
  tags: string[];
  feature: string;
  distance: string;
  link?: string;
  officialSource?: string;
  discount?: number;
  checkedAt?: string;
  live?: boolean;
};

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
];

type Language = "ru" | "en" | "tr";
type HistoryItem = { id: number; kind: "search" | "booking"; destination: string; dates: string; guests: number };

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
    heroCopy: "Собираем предложения отелей, апарт-отелей и вилл и показываем только те, где тот же отдых стоит дешевле официальной цены.", heroPromise: "Экономим ваши деньги. Качество отдыха неизменно.",
    where: "Куда", checkIn: "Заезд", checkOut: "Выезд", guests: "Гости", find: "Найти", searching: "Ищем…", popular: "Популярно:",
    selectDates: "Выберите даты", chooseArrival: "Сначала выберите дату заезда", chooseDeparture: "Теперь выберите дату выезда", close: "Готово", year: "Год", previousMonth: "Предыдущий месяц", nextMonth: "Следующий месяц",
    benefits: [["Цена со скидкой", "Ниже официальной на те же даты"], ["Один объект — одна карточка", "Без дублей в выдаче"], ["Прямой переход", "Бронирование у источника"], ["Только экономия", "Полные цены не показываем"]],
    picked: "Подобрали для вас", allTurkey: "Отдых по всей Турции", housing: "Отдых", variants: "вариантов в прототипе", filters: "Фильтры", reset: "Сбросить",
    sort: "Сортировка", sortDeal: "Выгодные сначала", sortCheap: "Сначала дешевле", sortRating: "По рейтингу", type: "Тип жилья", category: "Категория", all: "Все",
    allTypes: "Все варианты", hotel: "Отель", apart: "Апарт-отель", villa: "Вилла", area: "Площадь номера", anyArea: "Любая площадь", up20: "До 20 м²", from20: "От 20 до 30 м²", from30: "От 30 до 40 м²", over40: "Выше 40 м²",
    price: "Цена за 6 ночей", upTo: "до", meal: "Питание", anyMeal: "Любое питание", noMeal: "Без питания", breakfast: "Завтрак включён", halfBoard: "Полупансион · завтрак и ужин", fullBoard: "Полный пансион · завтрак, обед и ужин", allInclusive: "Всё включено", webTitle: "Поиск без договоров", webText: "Открытые страницы и поисковые ссылки. Цена всегда перепроверяется на сайте источника.",
    excellent: "Превосходно", reviews: "отзывов", upToGuests: "до", guestWord: "гостей", demoPrice: "за 6 ночей · демо-цена", checkWeb: "Проверить в интернете",
    requestReady: "Живой поиск завершён", requestText: "Показаны только предложения дешевле официальной цены на те же даты. Полные цены без скидки исключены.", noMatches: "Подтверждённых скидок пока нет", expand: "Попробуйте другие даты, направление или условия. Полные цены мы намеренно не показываем.", showTurkey: "Искать по всей Турции", deal: "к официальной цене", startLive: "Задайте даты и запустите живой поиск скидок", sourceMissing: "Для живого поиска требуется подключить технический ключ источника цен.", sizeAtSource: "Площадь у источника", officialPrice: "официальная цена", checkedNow: "проверено сейчас",
    howKicker: "Как работает Mareva", howA: "Мы ищем.", howB: "Вы выбираете.", howCopy: "Портал не принимает оплату и не скрывает источник предложения. На первом этапе он помогает сформировать точный запрос и проверить вариант в открытом интернете.",
    steps: [["Задайте условия", "Направление, даты, гости, тип жилья, площадь и бюджет."], ["Сравните варианты", "Единый формат карточек помогает быстро убрать неподходящее."], ["Проверьте цену", "Откроется свежая поисковая выдача с названием и городом объекта."], ["Бронируйте у источника", "Оплата и подтверждение происходят на выбранном внешнем сайте."]],
    roadmapKicker: "Развитие продукта", roadmapA: "Сегодня — веб-поиск.", roadmapB: "Завтра — единая цена.", roadmap: [["Сейчас", "Открытый веб-поиск", "Прямые ссылки, официальные сайты, ручная перепроверка."], ["Этап 2", "Поисковые API", "Автоматический сбор доступных страниц и обнаружение объектов."], ["Этап 3", "Партнёрские цены", "Наличие, точная стоимость и сравнение источников внутри портала."]], footerText: "Независимый поиск отдыха в Турции. Прототип MVP.", catalog: "Каталог", howSearch: "Как мы ищем",
    profileTitle: "Мой аккаунт", recent: "10 последних действий", localOnly: "Демо-кабинет: история хранится только в этом браузере.", search: "Поиск", booking: "Бронь", repeat: "Повторить",
    loginTitle: "Вход в Mareva", registerTitle: "Создать аккаунт", email: "Электронная почта", password: "Пароль", name: "Имя", patronymic: "Отчество", optional: "необязательно", continue: "Продолжить", create: "Создать аккаунт", authNote: "Демо-кабинет: достаточно имени, почта необязательна.", logout: "Выйти", favoritesTitle: "Избранное в аккаунте", noFavorites: "Сохраняйте понравившиеся варианты сердечком.", guestNote: "Искать и бронировать можно без регистрации. Гостевое избранное хранится только в текущей сессии.", keepFavorites: "Сохранить избранное в аккаунте",
  },
  en: {
    findStay: "Find a stay", how: "How it works", favorites: "Favorites", login: "Sign in", register: "Register", account: "Account",
    eyebrow: "Independent search across Turkey", heroA: "Turkey.", heroB: "Without overpaying.",
    heroCopy: "We find live deals below the official price. You save money while the quality of your holiday stays the same.", heroPromise: "Save money. Not memories.",
    where: "Where", checkIn: "Check-in", checkOut: "Check-out", guests: "Guests", find: "Search", searching: "Searching…", popular: "Popular:",
    selectDates: "Select dates", chooseArrival: "Choose your check-in date first", chooseDeparture: "Now choose your check-out date", close: "Done", year: "Year", previousMonth: "Previous month", nextMonth: "Next month",
    benefits: [["Discounted price", "Below the official price for the same dates"], ["One property, one card", "No duplicates"], ["Direct handoff", "Book with the source"], ["Savings only", "Full-price stays are hidden"]],
    picked: "Selected for you", allTurkey: "Stays across Turkey", housing: "Stays", variants: "prototype options", filters: "Filters", reset: "Reset",
    sort: "Sort", sortDeal: "Best deals first", sortCheap: "Lowest price", sortRating: "Highest rating", type: "Property type", category: "Category", all: "All",
    allTypes: "All properties", hotel: "Hotel", apart: "Aparthotel", villa: "Villa", area: "Room size", anyArea: "Any size", up20: "Up to 20 m²", from20: "20 to 30 m²", from30: "30 to 40 m²", over40: "Over 40 m²",
    price: "Price for 6 nights", upTo: "up to", meal: "Meal plan", anyMeal: "Any meal plan", noMeal: "No meals", breakfast: "Breakfast included", halfBoard: "Half board · breakfast and dinner", fullBoard: "Full board · breakfast, lunch and dinner", allInclusive: "All inclusive", webTitle: "Open web search", webText: "Public pages and search links. Always verify the final price with the source.",
    excellent: "Excellent", reviews: "reviews", upToGuests: "up to", guestWord: "guests", demoPrice: "6 nights · demo price", checkWeb: "Check on the web",
    requestReady: "Live search complete", requestText: "Only offers below the official price for the same dates are shown. Full-price stays are excluded.", noMatches: "No verified discounts yet", expand: "Try other dates, a wider destination or different preferences. We intentionally hide full-price stays.", showTurkey: "Search all Turkey", deal: "below official price", startLive: "Choose dates and run a live discount search", sourceMissing: "Live search needs a technical price-source key.", sizeAtSource: "Room size at source", officialPrice: "official price", checkedNow: "checked now",
    howKicker: "How Mareva works", howA: "We search.", howB: "You choose.", howCopy: "Mareva does not take payments or hide the offer source. At this stage it builds a precise request and helps you verify it on the open web.",
    steps: [["Set your preferences", "Destination, dates, guests, property type, room size and budget."], ["Compare options", "A consistent card format makes unsuitable stays easy to remove."], ["Check the price", "A fresh web search opens with the property name and city."], ["Book with the source", "Payment and confirmation happen on the external site you choose."]],
    roadmapKicker: "Product roadmap", roadmapA: "Today — web search.", roadmapB: "Tomorrow — one live price.", roadmap: [["Now", "Open web search", "Direct links, official websites and manual verification."], ["Stage 2", "Search APIs", "Automated discovery across permitted public pages."], ["Stage 3", "Partner pricing", "Availability, exact totals and source comparison inside Mareva."]], footerText: "Independent search for stays in Turkey. MVP prototype.", catalog: "Catalog", howSearch: "How we search",
    profileTitle: "My account", recent: "10 latest activities", localOnly: "Demo account: history is stored only in this browser.", search: "Search", booking: "Booking", repeat: "Repeat",
    loginTitle: "Sign in to Mareva", registerTitle: "Create an account", email: "Email", password: "Password", name: "Name", patronymic: "Middle name", optional: "optional", continue: "Continue", create: "Create account", authNote: "Demo account: a name is enough; email is optional.", logout: "Sign out", favoritesTitle: "Account favorites", noFavorites: "Save places you like with the heart button.", guestNote: "You can search and book without registering. Guest favorites last for this session only.", keepFavorites: "Save favorites to an account",
  },
  tr: {
    findStay: "Konaklama bul", how: "Nasıl çalışır", favorites: "Favoriler", login: "Giriş", register: "Kayıt ol", account: "Hesabım",
    eyebrow: "Türkiye genelinde bağımsız arama", heroA: "Türkiye.", heroB: "Fazla ödemeden.",
    heroCopy: "Resmi fiyattan daha düşük güncel fırsatları buluruz. Siz tasarruf ederken tatil kalitesi değişmez.", heroPromise: "Paradan tasarruf edin. Anılardan değil.",
    where: "Nereye", checkIn: "Giriş", checkOut: "Çıkış", guests: "Misafir", find: "Ara", searching: "Aranıyor…", popular: "Popüler:",
    selectDates: "Tarihleri seçin", chooseArrival: "Önce giriş tarihini seçin", chooseDeparture: "Şimdi çıkış tarihini seçin", close: "Tamam", year: "Yıl", previousMonth: "Önceki ay", nextMonth: "Sonraki ay",
    benefits: [["İndirimli fiyat", "Aynı tarihlerde resmi fiyattan düşük"], ["Bir tesis, bir kart", "Tekrarsız sonuçlar"], ["Doğrudan yönlendirme", "Kaynakta rezervasyon"], ["Yalnızca tasarruf", "Tam fiyatlı tesisler gizlenir"]],
    picked: "Sizin için seçtik", allTurkey: "Türkiye genelinde konaklama", housing: "Konaklama", variants: "prototip seçeneği", filters: "Filtreler", reset: "Sıfırla",
    sort: "Sıralama", sortDeal: "En iyi fırsatlar", sortCheap: "En düşük fiyat", sortRating: "En yüksek puan", type: "Konaklama türü", category: "Kategori", all: "Tümü",
    allTypes: "Tüm seçenekler", hotel: "Otel", apart: "Apart otel", villa: "Villa", area: "Oda büyüklüğü", anyArea: "Tüm büyüklükler", up20: "20 m²'ye kadar", from20: "20–30 m²", from30: "30–40 m²", over40: "40 m² üzeri",
    price: "6 gecelik fiyat", upTo: "en fazla", meal: "Yemek planı", anyMeal: "Tüm yemek planları", noMeal: "Yemeksiz", breakfast: "Kahvaltı dahil", halfBoard: "Yarım pansiyon · kahvaltı ve akşam yemeği", fullBoard: "Tam pansiyon · kahvaltı, öğle ve akşam yemeği", allInclusive: "Her şey dahil", webTitle: "Açık web araması", webText: "Herkese açık sayfalar ve arama bağlantıları. Son fiyatı her zaman kaynakta doğrulayın.",
    excellent: "Mükemmel", reviews: "yorum", upToGuests: "en fazla", guestWord: "misafir", demoPrice: "6 gece · demo fiyat", checkWeb: "Web'de kontrol et",
    requestReady: "Canlı arama tamamlandı", requestText: "Yalnızca aynı tarihlerde resmi fiyattan daha ucuz teklifler gösterilir. Tam fiyatlı tesisler gizlenir.", noMatches: "Doğrulanmış indirim bulunamadı", expand: "Farklı tarihler, konum veya koşullar deneyin. Tam fiyatlı tesisleri bilerek göstermiyoruz.", showTurkey: "Tüm Türkiye'de ara", deal: "resmi fiyata göre", startLive: "Tarihleri seçip canlı indirim araması başlatın", sourceMissing: "Canlı arama için teknik fiyat kaynağı anahtarı gerekir.", sizeAtSource: "Oda büyüklüğü kaynakta", officialPrice: "resmi fiyat", checkedNow: "şimdi kontrol edildi",
    howKicker: "Mareva nasıl çalışır", howA: "Biz ararız.", howB: "Siz seçersiniz.", howCopy: "Mareva ödeme almaz ve teklif kaynağını gizlemez. İlk aşamada kesin bir arama oluşturur ve açık web'de doğrulamanıza yardımcı olur.",
    steps: [["Koşulları belirleyin", "Konum, tarihler, misafirler, konaklama türü, oda büyüklüğü ve bütçe."], ["Seçenekleri karşılaştırın", "Tek kart düzeni uygun olmayan seçenekleri kolayca elemenizi sağlar."], ["Fiyatı kontrol edin", "Tesis adı ve şehirle güncel web araması açılır."], ["Kaynakta rezervasyon yapın", "Ödeme ve onay seçtiğiniz dış sitede gerçekleşir."]],
    roadmapKicker: "Ürün yol haritası", roadmapA: "Bugün — web araması.", roadmapB: "Yarın — tek güncel fiyat.", roadmap: [["Şimdi", "Açık web araması", "Doğrudan bağlantılar, resmi siteler ve manuel kontrol."], ["Aşama 2", "Arama API'leri", "İzin verilen sayfalarda otomatik tesis keşfi."], ["Aşama 3", "Ortak fiyatları", "Mareva içinde müsaitlik, toplam fiyat ve kaynak karşılaştırması."]], footerText: "Türkiye'de bağımsız konaklama araması. MVP prototipi.", catalog: "Katalog", howSearch: "Nasıl ararız",
    profileTitle: "Hesabım", recent: "Son 10 işlem", localOnly: "Demo hesap: geçmiş yalnızca bu tarayıcıda saklanır.", search: "Arama", booking: "Rezervasyon", repeat: "Tekrarla",
    loginTitle: "Mareva'ya giriş", registerTitle: "Hesap oluştur", email: "E-posta", password: "Şifre", name: "Ad", patronymic: "İkinci ad", optional: "isteğe bağlı", continue: "Devam et", create: "Hesap oluştur", authNote: "Demo hesap: ad yeterlidir; e-posta isteğe bağlıdır.", logout: "Çıkış", favoritesTitle: "Hesaptaki favoriler", noFavorites: "Beğendiğiniz yerleri kalp düğmesiyle kaydedin.", guestNote: "Kayıt olmadan arama ve rezervasyon yapabilirsiniz. Misafir favorileri yalnızca bu oturumda saklanır.", keepFavorites: "Favorileri hesaba kaydet",
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
  const start = parseIso(checkIn).getTime();
  const end = parseIso(checkOut).getTime();
  return (
    <div className="calendar-month">
      <h3>{new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(month)}</h3>
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
  const [checkIn, setCheckIn] = useState("2026-09-14");
  const [checkOut, setCheckOut] = useState("2026-09-20");
  const [guests, setGuests] = useState(2);
  const [type, setType] = useState("Все варианты");
  const [stars, setStars] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1400);
  const [sizeRange, setSizeRange] = useState("any");
  const [mealPlan, setMealPlan] = useState("any");
  const [sort, setSort] = useState("Выгодные сначала");
  const [saved, setSaved] = useState<Array<number | string>>([]);
  const [savedStays, setSavedStays] = useState<Stay[]>([]);
  const [searched, setSearched] = useState(false);
  const [searching, setSearching] = useState(false);
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
  const t = translations[language];
  const locale = language === "ru" ? "ru-RU" : language === "tr" ? "tr-TR" : "en-GB";

  useEffect(() => {
    const storedHistory = window.localStorage.getItem("mareva-history");
    const storedUser = window.localStorage.getItem("mareva-demo-user");
    const guestHistory = window.sessionStorage.getItem("mareva-guest-history");
    if (storedUser) {
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
      const typeOk = type === "Все варианты" || stay.type === type;
      const sizeOk =
        sizeRange === "any" ||
        (sizeRange === "up-to-20" && stay.roomSize !== null && stay.roomSize <= 20) ||
        (sizeRange === "20-30" && stay.roomSize !== null && stay.roomSize >= 20 && stay.roomSize < 30) ||
        (sizeRange === "30-40" && stay.roomSize !== null && stay.roomSize >= 30 && stay.roomSize <= 40) ||
        (sizeRange === "over-40" && stay.roomSize !== null && stay.roomSize > 40);
      const mealOk = mealPlan === "any" || mealPlanOf(stay) === mealPlan;
      return cityOk && typeOk && stay.stars >= stars && stay.price <= maxPrice && sizeOk && mealOk && stay.guests >= guests;
    });
    if (sort === "Сначала дешевле") items = [...items].sort((a, b) => a.price - b.price);
    if (sort === "По рейтингу") items = [...items].sort((a, b) => b.score - a.score);
    if (sort === "Выгодные сначала") items = [...items].sort((a, b) => (b.oldPrice - b.price) / b.oldPrice - (a.oldPrice - a.price) / a.oldPrice);
    return items;
  }, [destination, guests, liveStays, maxPrice, mealPlan, sizeRange, sort, stars, type]);

  async function runSearch() {
    setSearching(true);
    setSearchError("");
    setSearched(false);
    void trackActivity("search", destination);
    try {
      const params = new URLSearchParams({ destination, checkIn, checkOut, guests: String(guests), language });
      const response = await fetch(`/api/hotels/search?${params.toString()}`);
      const payload = await response.json() as { offers?: Stay[]; error?: string; message?: string };
      if (!response.ok) throw new Error(payload.error === "SOURCE_NOT_CONFIGURED" ? t.sourceMissing : payload.message || t.noMatches);
      setLiveStays(payload.offers || []);
      const item: HistoryItem = {
        id: Date.now(), kind: "search", destination,
        dates: `${checkIn.split("-").reverse().slice(0, 2).join(".")}–${checkOut.split("-").reverse().join(".")}`,
        guests,
      };
      setHistory((current) => {
        const next = [item, ...current].slice(0, 10);
        const storage = signedIn ? window.localStorage : window.sessionStorage;
        storage.setItem(signedIn ? "mareva-history" : "mareva-guest-history", JSON.stringify(next));
        return next;
      });
      setSearched(true);
      document.getElementById("results")?.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (error) {
      setLiveStays([]);
      setSearched(true);
      setSearchError(error instanceof Error ? error.message : t.noMatches);
    } finally {
      setSearching(false);
    }
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

  function displayDate(value: string) {
    return new Intl.DateTimeFormat(locale, { day: "numeric", month: "long" }).format(parseIso(value));
  }

  const calendarMonths = useMemo(() => Array.from({ length: 12 }, (_, month) => new Intl.DateTimeFormat(locale, { month: "long" }).format(new Date(calendarMonth.getFullYear(), month, 1))), [calendarMonth, locale]);

  function moveCalendar(direction: -1 | 1) {
    const next = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + direction, 1);
    if (next.getFullYear() < 2026 || next.getFullYear() > 2027) return;
    setCalendarMonth(next);
  }

  function selectDate(value: Date) {
    if (datePicker === "checkIn") {
      setCheckIn(toIso(value));
      if (value.getTime() >= parseIso(checkOut).getTime()) {
        const next = new Date(value);
        next.setDate(next.getDate() + 1);
        setCheckOut(toIso(next));
      }
      setDatePicker("checkOut");
      return;
    }
    if (value.getTime() <= parseIso(checkIn).getTime()) {
      setCheckIn(toIso(value));
      setDatePicker("checkOut");
      return;
    }
    setCheckOut(toIso(value));
    setDatePicker(null);
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

  return (
    <main>
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
          <div className="search-field date-field">
            <span>{t.checkIn}</span>
            <button type="button" onClick={() => { setDatePicker("checkIn"); setCalendarMonth(new Date(parseIso(checkIn).getFullYear(), parseIso(checkIn).getMonth(), 1)); }}>{displayDate(checkIn)} <b>⌄</b></button>
          </div>
          <div className="search-field date-field">
            <span>{t.checkOut}</span>
            <button type="button" onClick={() => { setDatePicker("checkOut"); setCalendarMonth(new Date(parseIso(checkOut).getFullYear(), parseIso(checkOut).getMonth(), 1)); }}>{displayDate(checkOut)} <b>⌄</b></button>
          </div>
          <label className="search-field">
            <span>{t.guests}</span>
            <select value={guests} onChange={(event) => setGuests(Number(event.target.value))}>
              {Array.from({ length: 10 }, (_, index) => index + 1).map((item) => (
                <option value={item} key={item}>
                  {item} {language === "tr" ? "misafir" : language === "en" ? (item === 1 ? "guest" : "guests") : item === 1 ? "гость" : item < 5 ? "гостя" : "гостей"}
                </option>
              ))}
            </select>
          </label>
          <button className="search-button" onClick={runSearch} disabled={searching}>
            {searching ? t.searching : t.find}<span aria-hidden="true">→</span>
          </button>
        </div>
        </div>
        {datePicker && <div className="calendar-overlay" role="presentation" onMouseDown={(event) => { if (event.currentTarget === event.target) setDatePicker(null); }}>
          <div className="calendar-modal" role="dialog" aria-modal="true" aria-label={t.selectDates}>
            <div className="calendar-head">
              <div className="calendar-title"><strong>{t.selectDates}</strong><span>{datePicker === "checkIn" ? t.chooseArrival : t.chooseDeparture}</span></div>
              <button type="button" className="calendar-close" aria-label={t.close} onClick={() => setDatePicker(null)}>×</button>
            </div>

            <div className="calendar-date-tabs" role="tablist" aria-label={t.selectDates}>
              <button type="button" role="tab" aria-selected={datePicker === "checkIn"} className={datePicker === "checkIn" ? "active" : ""} onClick={() => { setDatePicker("checkIn"); setCalendarMonth(new Date(parseIso(checkIn).getFullYear(), parseIso(checkIn).getMonth(), 1)); }}><span>{t.checkIn}</span><strong>{displayDate(checkIn)}</strong></button>
              <button type="button" role="tab" aria-selected={datePicker === "checkOut"} className={datePicker === "checkOut" ? "active" : ""} onClick={() => { setDatePicker("checkOut"); setCalendarMonth(new Date(parseIso(checkOut).getFullYear(), parseIso(checkOut).getMonth(), 1)); }}><span>{t.checkOut}</span><strong>{displayDate(checkOut)}</strong></button>
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
            <p>{filtered.length} {t.variants} · {checkIn.split("-").reverse().join(".")} — {checkOut.split("-").reverse().join(".")}</p>
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
            <div className="filter-title"><strong>{t.filters}</strong><button onClick={() => { setType("Все варианты"); setStars(0); setMaxPrice(1400); setSizeRange("any"); setMealPlan("any"); }}>{t.reset}</button></div>
            <fieldset>
              <legend>{t.type}</legend>
              {[["Все варианты", t.allTypes], ["Отель", t.hotel], ["Апарт-отель", t.apart], ["Вилла", t.villa]].map(([value, label]) => (
                <label className="radio-row" key={value}><input type="radio" name="type" checked={type === value} onChange={() => setType(value)} /><span>{label}</span></label>
              ))}
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
              <input className="range" type="range" min="400" max="1400" step="50" value={maxPrice} onChange={(event) => setMaxPrice(Number(event.target.value))} />
              <div className="range-labels"><span>€400</span><span>€1 400+</span></div>
            </fieldset>
            <div className="source-card"><span>WEB</span><strong>{t.webTitle}</strong><p>{t.webText}</p></div>
          </aside>

          <div className="results-list">
            {!searched && <div className="empty-state live-intro"><span>⌁</span><h3>{t.startLive}</h3><p>{t.requestText}</p></div>}
            {searched && filtered.length === 0 && (
              <div className="empty-state"><span>⌁</span><h3>{searchError || t.noMatches}</h3><p>{searchError ? t.sourceMissing : t.expand}</p><button onClick={() => { setDestination("Вся Турция"); setMaxPrice(1400); setSizeRange("any"); setMealPlan("any"); }}>{t.showTurkey}</button></div>
            )}
            {filtered.map((stay) => {
              const discount = stay.discount ?? Math.round((1 - stay.price / stay.oldPrice) * 100);
              return (
                <article className="hotel-card" key={stay.id}>
                  <div className="hotel-image-wrap">
                    <img className="hotel-image" src={stay.image || "/hero-istanbul.png"} alt={`${stay.name}, ${stay.city}`} />
                    <span className="deal-badge">−{discount}% {t.deal}</span>
                    <button className={`heart ${saved.includes(stay.id) ? "saved" : ""}`} onClick={() => toggleSaved(stay)} aria-label={saved.includes(stay.id) ? "Удалить из избранного" : "Добавить в избранное"}>{saved.includes(stay.id) ? "♥" : "♡"}</button>
                    <span className="photo-count">1 / 8</span>
                  </div>
                  <div className="hotel-content">
                    <div className="hotel-topline"><span>{stay.type === "Отель" ? t.hotel : stay.type === "Апарт-отель" ? t.apart : t.villa}</span><Stars count={stay.stars} /></div>
                    <h3>{stay.name}</h3>
                    <p className="location">{stay.area}, {destinationNames[language][stay.city]} · {stay.distance}</p>
                    <div className="rating-row"><strong>{stay.score}</strong><span>{t.excellent}<br/><small>{stay.reviews} {t.reviews}</small></span></div>
                    <div className="room-line"><strong>{stay.roomSize ? `${stay.roomSize} м²` : t.sizeAtSource} · {t.upToGuests} {stay.guests} {t.guestWord}</strong><span>{stay.feature}</span></div>
                    <div className="tag-row">{stay.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                    <div className="price-row">
                      <div><span className="old-price">€{stay.oldPrice.toLocaleString(locale)} · {t.officialPrice}</span><strong>€{stay.price.toLocaleString(locale)}</strong><small>{stay.live ? `${stay.feature} · ${t.checkedNow}` : t.demoPrice}</small></div>
                      <a className="check-button" href={stay.link || outboundUrl(stay, destination)} target="_blank" rel="noreferrer" onClick={() => void trackActivity("outbound", stay.city)}>{t.checkWeb} <span>↗</span></a>
                    </div>
                  </div>
                </article>
              );
            })}
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
