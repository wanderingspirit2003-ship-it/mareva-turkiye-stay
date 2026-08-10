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

const stays: Stay[] = [
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

const destinations = ["Анталья", "Бодрум", "Каш", "Вся Турция"];

function Stars({ count }: { count: number }) {
  return <span className="stars" aria-label={`${count} звёзд`}>{"★".repeat(count)}</span>;
}

function outboundUrl(stay: Stay, destination: string) {
  const place = destination === "Вся Турция" ? stay.city : destination;
  return `https://www.google.com/travel/search?q=${encodeURIComponent(`${stay.name} ${place} Turkey hotel`)}`;
}

export default function Home() {
  const [destination, setDestination] = useState("Анталья");
  const [checkIn, setCheckIn] = useState("2026-09-14");
  const [checkOut, setCheckOut] = useState("2026-09-20");
  const [guests, setGuests] = useState(2);
  const [type, setType] = useState("Все варианты");
  const [stars, setStars] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1400);
  const [minSize, setMinSize] = useState(0);
  const [sort, setSort] = useState("Выгодные сначала");
  const [saved, setSaved] = useState<number[]>([4]);
  const [searched, setSearched] = useState(false);
  const [searching, setSearching] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    let items = stays.filter((stay) => {
      const cityOk = destination === "Вся Турция" || stay.city === destination;
      const typeOk = type === "Все варианты" || stay.type === type;
      return cityOk && typeOk && stay.stars >= stars && stay.price <= maxPrice && stay.roomSize >= minSize && stay.guests >= guests;
    });
    if (sort === "Сначала дешевле") items = [...items].sort((a, b) => a.price - b.price);
    if (sort === "По рейтингу") items = [...items].sort((a, b) => b.score - a.score);
    if (sort === "Выгодные сначала") items = [...items].sort((a, b) => (b.oldPrice - b.price) / b.oldPrice - (a.oldPrice - a.price) / a.oldPrice);
    return items;
  }, [destination, guests, maxPrice, minSize, sort, stars, type]);

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
              {[1, 2, 3, 4, 5].map((item) => <option value={item} key={item}>{item} {item === 1 ? "гость" : "гостя"}</option>)}
            </select>
          </label>
          <button className="search-button" onClick={runSearch} disabled={searching}>
            {searching ? "Ищем…" : "Найти"}<span aria-hidden="true">→</span>
          </button>
        </div>
        <div className="popular">Популярно: <button onClick={() => setDestination("Анталья")}>Анталья</button><button onClick={() => setDestination("Бодрум")}>Бодрум</button><button onClick={() => setDestination("Каш")}>Каш</button></div>

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
            <div className="filter-title"><strong>Фильтры</strong><button onClick={() => { setType("Все варианты"); setStars(0); setMaxPrice(1400); setMinSize(0); }}>Сбросить</button></div>
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
              <select value={minSize} onChange={(event) => setMinSize(Number(event.target.value))}>
                <option value={0}>Любая площадь</option>
                <option value={20}>От 20 м²</option>
                <option value={30}>От 30 м²</option>
                <option value={40}>От 40 м²</option>
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
              <div className="empty-state"><span>⌁</span><h3>Подходящих вариантов пока нет</h3><p>Расширьте направление, бюджет или площадь номера.</p><button onClick={() => { setDestination("Вся Турция"); setMaxPrice(1400); setMinSize(0); }}>Показать всю Турцию</button></div>
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
