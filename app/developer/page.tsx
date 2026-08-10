"use client";

import { useEffect, useState } from "react";

type Analytics = {
  totals: { visits: number; searches: number; outbound: number; unique_sessions: number };
  destinations: Array<{ destination: string; searches: number }>;
  daily: Array<{ day: string; visits: number; searches: number; outbound: number }>;
};

export default function DeveloperDashboard() {
  const [data, setData] = useState<Analytics | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/analytics").then((response) => {
      if (!response.ok) throw new Error("Не удалось загрузить статистику");
      return response.json();
    }).then(setData).catch((reason) => setError(reason.message));
  }, []);

  const maxDaily = data ? Math.max(1, ...data.daily.map((item) => Number(item.visits) + Number(item.searches))) : 1;
  const ctr = data && Number(data.totals.searches) > 0 ? Math.round(Number(data.totals.outbound) / Number(data.totals.searches) * 100) : 0;

  return <main className="developer-page">
    <header className="developer-header"><a href="/"><img src="/favicon.png" alt="" /><span>mareva</span></a><span>Developer pulse</span></header>
    <section className="developer-hero"><span>Внутренняя аналитика</span><h1>Как работает<br/><em>наш портал.</em></h1><p>Посещения, поиски и переходы к бронированию. Данные обновляются после перезагрузки страницы.</p></section>
    {error && <div className="developer-error">{error}</div>}
    {!data && !error ? <div className="developer-loading">Загружаем активность…</div> : data && <section className="developer-content">
      <div className="metric-grid">
        <article><span>Все посещения</span><strong>{Number(data.totals.visits || 0).toLocaleString("ru-RU")}</strong><small>{Number(data.totals.unique_sessions || 0)} уникальных сессий</small></article>
        <article><span>Поисковые запросы</span><strong>{Number(data.totals.searches || 0).toLocaleString("ru-RU")}</strong><small>запусков живого поиска</small></article>
        <article><span>Переходы к источнику</span><strong>{Number(data.totals.outbound || 0).toLocaleString("ru-RU")}</strong><small>к бронированию</small></article>
        <article className="accent"><span>Search → booking</span><strong>{ctr}%</strong><small>конверсия в переход</small></article>
      </div>
      <div className="developer-panels">
        <article className="activity-panel"><div className="panel-title"><span>Последние 7 дней</span><strong>Активность</strong></div><div className="activity-chart">{data.daily.length ? data.daily.map((item) => <div className="activity-day" key={item.day}><div><i style={{ height: `${Math.max(5, (Number(item.visits) + Number(item.searches)) / maxDaily * 100)}%` }} /></div><strong>{new Date(`${item.day}T00:00:00`).toLocaleDateString("ru-RU", { weekday: "short" })}</strong><small>{Number(item.visits) + Number(item.searches)}</small></div>) : <p>Активность появится после первых посещений.</p>}</div></article>
        <article className="destination-panel"><div className="panel-title"><span>Интерес пользователей</span><strong>Популярные направления</strong></div>{data.destinations.length ? <ol>{data.destinations.map((item, index) => <li key={item.destination}><span>{String(index + 1).padStart(2, "0")}</span><strong>{item.destination}</strong><b>{item.searches}</b></li>)}</ol> : <p>Поисков пока нет.</p>}</article>
      </div>
    </section>}
  </main>;
}
