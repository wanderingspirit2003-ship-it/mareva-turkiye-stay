"use client";

import { useMemo, useState } from "react";

type Stay = {
  id: number;
  name: string;
  city: string;
  area: string;
  type: "Отель" | "Апарт-отель" | "Вилла";
  stars: number;
  score: number;
  reviews: number;
  roomSize: number;
  guests: number;
  price: number;
  oldPrice: number;
  image: string;
  tags: string[];
  feature: string;
  distance: string;
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
    tags: ["Отдельный дом", "Частный бассейн"],
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

function Stars({ count }: { count: number }) {
  return <span className="stars" aria-label={`${count} звёзд`}>{"★".repeat(count)}</span>;
}

function outboundUrl(stay: Stay, destination: string) {
  const place = destination === "Вся Турция" ? stay.city : destination;
  return `https://www.google.com/travel/search?q=${encodeURIComponent(`${stay.name} ${place} Turkey hotel`)}`;
}

export default function Home() {
  const [destination, setDestination] = useState("Вся Турция");
  const [checkIn, setCheckIn] = useState("2026-09-14");
  const [checkOut, setCheckOut] = useState("2026-09-20");
  const [guests, setGuests] = useState(2);
  const [type, setType] = useState("Все варианты");
  const [stars, setStars] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1400);
  const [sizeRange, setSizeRange] = useState("any");
  const [sort, setSort] = useState("Выгодные сначала");
  const [saved, setSaved] = useState<number[]>([4]);
  const [searched, setSearched] = useState(false);
  const [searching, setSearching] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    let items = stays.filter((stay) => {
      const cityOk = destination === "Вся Турция" || stay.city === destination;
      const typeOk = type === "Все варианты" || stay.type === type;
      const sizeOk =
        sizeRange === "any" ||
        (sizeRange === "up-to-20" && stay.roomSize <= 20) ||
        (sizeRange === "20-30" && stay.roomSize >= 20 && stay.roomSize < 30) ||
        (sizeRange === "30-40" && stay.roomSize >= 30 && stay.roomSize <= 40) ||
        (sizeRange === "over-40" && stay.roomSize > 40);
      return cityOk && typeOk && stay.stars >= stars && stay.price <= maxPrice && sizeOk && stay.guests >= guests;
    });
    if (sort === "Сначала дешевле") items = [...items].sort((a, b) => a.price - b.price);
    if (sort === "По рейтингу") items = [...items].sort((a, b) => b.score - a.score);
    if (sort === "Выгодные сначала") items = [...items].sort((a, b) => (b.oldPrice - b.price) / b.oldPrice - (a.oldPrice - a.price) / a.oldPrice);
    return items;
  }, [destination, guests, maxPrice, sizeRange, sort, stars, type]);

  function runSearch() {
    setSearching(true);
    setTimeout(() => {
      setSearching(false);
      setSearched(true);
      document.getElementById("results")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 700);
  }

  function toggleSaved(id: number) {
    setSaved((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Mareva — на главную">
          <span className="brand-mark">M</span>
          <span>mareva</span>
        </a>
        <nav aria-label="Главное меню">
          <a href="#results">Найти жильё</a>
          <a href="#how">Как это работает</a>
          <button className="saved-link" type="button">Избранное <span>{saved.length}</span></button>
        </nav>
        <button className="profile" type="button" aria-label="Открыть профиль">АЯ</button>
      </header>

      <section className="hero" id="top">
        <div className="eyebrow"><span className="live-dot" /> Независимый поиск по Турции</div>
        <h1>Турция.<br/><em>Без переплаты.</em></h1>
        <p className="hero-copy">Собираем отели, апарт-отели и виллы в одном поиске. Показываем полную цену и отправляем бронировать прямо к источнику.</p>

        <div className="search-panel" aria-label="Поиск жилья">
          <label className="search-field destination-field">
            <span>Куда</span>
            <select value={destination} onChange={(event) => setDestination(event.target.value)}>
              {destinations.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label className="search-field">
            <span>Заезд</span>
            <input type="date" value={checkIn} onChange={(event) => setCheckIn(event.target.value)} />
          </label>
          <label className="search-field">
            <span>Выезд</span>
            <input type="date" value={checkOut} onChange={(event) => setCheckOut(event.target.value)} />
          </label>
          <label className="search-field">
            <span>Гости</span>
            <select value={guests} onChange={(event) => setGuests(Number(event.target.value))}>
              <option value={1}>1 гость</option>
              <option value={2}>2 гостя</option>
              <option value={3}>3 гостя</option>
              <option value={4}>4 гостя</option>
              <option value={5}>5 гостей</option>
            </select>
          </label>
          <button className="search-button" onClick={runSearch} disabled={searching}>
            {searching ? "Ищем…" : "Найти"}<span aria-hidden="true">→</span>
          </button>
        </div>
        <div className="popular">Популярно: <button onClick={() => setDestination("Анталья")}>Анталья</button><button onClick={() => setDestination("Сиде")}>Сиде</button><button onClick={() => setDestination("Кемер")}>Кемер</button><button onClick={() => setDestination("Бодрум")}>Бодрум</button><button onClick={() => setDestination("Мармарис")}>Мармарис</button><button onClick={() => setDestination("Фетхие")}>Фетхие</button></div>

        <div className="hero-orbit orbit-one" aria-hidden="true" />
        <div className="hero-orbit orbit-two" aria-hidden="true" />
        <div className="sun-mark" aria-hidden="true">✦</div>
      </section>

      <section className="trust-strip" aria-label="Преимущества">
        <div><strong>Цена целиком</strong><span>За все ночи, а не «от»</span></div>
        <div><strong>Один объект — одна карточка</strong><span>Без дублей в выдаче</span></div>
        <div><strong>Прямой переход</strong><span>Бронирование у источника</span></div>
        <div className="demo-note"><strong>Режим прототипа</strong><span>Цены ниже — демонстрационные</span></div>
      </section>

      <section className="results-section" id="results">
        <div className="results-heading">
          <div>
            <span className="section-kicker">Подобрали для вас</span>
            <h2>{destination === "Вся Турция" ? "Жильё по всей Турции" : `Жильё: ${destination}`}</h2>
            <p>{filtered.length} вариантов в прототипе · {checkIn.split("-").reverse().join(".")} — {checkOut.split("-").reverse().join(".")}</p>
          </div>
          <div className="heading-actions">
            <button className="filter-mobile" onClick={() => setFiltersOpen(!filtersOpen)}>Фильтры</button>
            <label className="sort-label">Сортировка
              <select value={sort} onChange={(event) => setSort(event.target.value)}>
                <option>Выгодные сначала</option>
                <option>Сначала дешевле</option>
                <option>По рейтингу</option>
              </select>
            </label>
          </div>
        </div>

        {searched && (
          <div className="search-status">
            <span className="status-icon">✓</span>
            <div><strong>Запрос подготовлен</strong><span>Для актуальных цен используйте «Проверить в интернете». Портал передаст название, город и даты внешнему поиску.</span></div>
            <button onClick={() => setSearched(false)} aria-label="Закрыть уведомление">×</button>
          </div>
        )}

        <div className="catalog-layout">
          <aside className={filtersOpen ? "filters open" : "filters"}>
            <div className="filter-title"><strong>Фильтры</strong><button onClick={() => { setType("Все варианты"); setStars(0); setMaxPrice(1400); setSizeRange("any"); }}>Сбросить</button></div>
            <fieldset>
              <legend>Тип жилья</legend>
              {["Все варианты", "Отель", "Апарт-отель", "Вилла"].map((item) => (
                <label className="radio-row" key={item}><input type="radio" name="type" checked={type === item} onChange={() => setType(item)} /><span>{item}</span></label>
              ))}
            </fieldset>
            <fieldset>
              <legend>Категория</legend>
              <div className="star-filter">
                {[0, 3, 4, 5].map((item) => <button className={stars === item ? "active" : ""} onClick={() => setStars(item)} key={item}>{item === 0 ? "Все" : `${item}★`}</button>)}
              </div>
            </fieldset>
            <fieldset>
              <legend>Площадь номера</legend>
              <select value={sizeRange} onChange={(event) => setSizeRange(event.target.value)}>
                <option value="any">Любая площадь</option>
                <option value="up-to-20">До 20 м²</option>
                <option value="20-30">От 20 до 30 м²</option>
                <option value="30-40">От 30 до 40 м²</option>
                <option value="over-40">Выше 40 м²</option>
              </select>
            </fieldset>
            <fieldset>
              <legend>Цена за 6 ночей</legend>
              <div className="range-value">до €{maxPrice.toLocaleString("ru-RU")}</div>
              <input className="range" type="range" min="400" max="1400" step="50" value={maxPrice} onChange={(event) => setMaxPrice(Number(event.target.value))} />
              <div className="range-labels"><span>€400</span><span>€1 400+</span></div>
            </fieldset>
            <div className="source-card"><span>WEB</span><strong>Поиск без договоров</strong><p>Открытые страницы и поисковые ссылки. Цена всегда перепроверяется на сайте источника.</p></div>
          </aside>

          <div className="results-list">
            {filtered.length === 0 && (
              <div className="empty-state"><span>⌁</span><h3>Подходящих вариантов пока нет</h3><p>Расширьте направление, бюджет или площадь номера.</p><button onClick={() => { setDestination("Вся Турция"); setMaxPrice(1400); setSizeRange("any"); }}>Показать всю Турцию</button></div>
            )}
            {filtered.map((stay) => {
              const discount = Math.round((1 - stay.price / stay.oldPrice) * 100);
              return (
                <article className="hotel-card" key={stay.id}>
                  <div className="hotel-image-wrap">
                    <img className="hotel-image" src={stay.image} alt={`${stay.name}, ${stay.city}`} />
                    <span className="deal-badge">−{discount}% к обычной цене</span>
                    <button className={`heart ${saved.includes(stay.id) ? "saved" : ""}`} onClick={() => toggleSaved(stay.id)} aria-label={saved.includes(stay.id) ? "Удалить из избранного" : "Добавить в избранное"}>{saved.includes(stay.id) ? "♥" : "♡"}</button>
                    <span className="photo-count">1 / 8</span>
                  </div>
                  <div className="hotel-content">
                    <div className="hotel-topline"><span>{stay.type}</span><Stars count={stay.stars} /></div>
                    <h3>{stay.name}</h3>
                    <p className="location">{stay.area}, {stay.city} · {stay.distance}</p>
                    <div className="rating-row"><strong>{stay.score}</strong><span>Превосходно<br/><small>{stay.reviews} отзывов</small></span></div>
                    <div className="room-line"><strong>{stay.roomSize} м² · до {stay.guests} гостей</strong><span>{stay.feature}</span></div>
                    <div className="tag-row">{stay.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                    <div className="price-row">
                      <div><span className="old-price">€{stay.oldPrice.toLocaleString("ru-RU")}</span><strong>€{stay.price.toLocaleString("ru-RU")}</strong><small>за 6 ночей · демо-цена</small></div>
                      <a className="check-button" href={outboundUrl(stay, destination)} target="_blank" rel="noreferrer">Проверить в интернете <span>↗</span></a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="how-section" id="how">
        <div className="how-intro"><span className="section-kicker">Как работает Mareva</span><h2>Мы ищем.<br/>Вы выбираете.</h2><p>Портал не принимает оплату и не скрывает источник предложения. На первом этапе он помогает сформировать точный запрос и проверить вариант в открытом интернете.</p></div>
        <ol className="steps">
          <li><span>01</span><div><strong>Задайте условия</strong><p>Направление, даты, гости, тип жилья, площадь и бюджет.</p></div></li>
          <li><span>02</span><div><strong>Сравните варианты</strong><p>Единый формат карточек помогает быстро убрать неподходящее.</p></div></li>
          <li><span>03</span><div><strong>Проверьте цену</strong><p>Откроется свежая поисковая выдача с названием и городом объекта.</p></div></li>
          <li><span>04</span><div><strong>Бронируйте у источника</strong><p>Оплата и подтверждение происходят на выбранном внешнем сайте.</p></div></li>
        </ol>
      </section>

      <section className="roadmap">
        <div><span className="section-kicker">Развитие продукта</span><h2>Сегодня — веб-поиск.<br/>Завтра — единая цена.</h2></div>
        <div className="roadmap-track">
          <div className="roadmap-item active"><span>Сейчас</span><strong>Открытый веб-поиск</strong><p>Прямые ссылки, официальные сайты, ручная перепроверка.</p></div>
          <div className="roadmap-item"><span>Этап 2</span><strong>Поисковые API</strong><p>Автоматический сбор доступных страниц и обнаружение объектов.</p></div>
          <div className="roadmap-item"><span>Этап 3</span><strong>Партнёрские цены</strong><p>Наличие, точная стоимость и сравнение источников внутри портала.</p></div>
        </div>
      </section>

      <footer>
        <a className="brand footer-brand" href="#top"><span className="brand-mark">M</span><span>mareva</span></a>
        <p>Независимый поиск жилья в Турции. Прототип MVP.</p>
        <div><a href="#how">Как мы ищем</a><a href="#results">Каталог</a><span>RU · EUR</span></div>
      </footer>
    </main>
  );
}
