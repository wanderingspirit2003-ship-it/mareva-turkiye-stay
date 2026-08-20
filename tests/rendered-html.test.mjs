import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the Mareva hotel portal", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /Mareva — поиск отелей в Турции/i);
  assert.match(html, /Турция\.<br\/><em>Без переплаты\.<\/em>/i);
  assert.match(html, /Найти место для отдыха/i);
  assert.match(html, /value="10"/i);
  assert.match(html, /max="10000"/i);
  assert.match(html, /Максимальная цена за сутки/i);
  assert.match(html, /Сказать условия голосом/i);
  assert.match(html, /Название отеля/i);
  assert.match(html, /Mareva AI/i);
  assert.match(html, /class="ai-launcher/i);
});

test("keeps AI credentials server-side", async () => {
  const [page, route, css, envExample, gitignore] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/api/agent/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../.env.example", import.meta.url), "utf8"),
    readFile(new URL("../.gitignore", import.meta.url), "utf8"),
  ]);

  assert.match(page, /fetch\("\/api\/agent"/);
  assert.match(page, /applyAgentFilters/);
  assert.match(route, /https:\/\/api\.openai\.com\/v1\/chat\/completions/);
  assert.match(route, /https:\/\/openrouter\.ai\/api\/v1\/chat\/completions/);
  assert.match(route, /prepare_hotel_search/);
  assert.match(route, /hotelName/);
  assert.match(route, /maximum: 10000/);
  assert.match(route, /OPENAI_API_KEY/);
  assert.match(route, /OPENROUTER_API_KEY/);
  assert.match(css, /\.ai-panel\s*\{[^}]*position:\s*fixed/s);
  assert.match(envExample, /^OPENAI_API_KEY=$/m);
  assert.match(envExample, /^OPENAI_MODEL=gpt-4\.1-mini$/m);
  assert.match(envExample, /^OPENROUTER_API_KEY=$/m);
  assert.match(gitignore, /^\.env\*$/m);
  assert.doesNotMatch(page, /sk-or-v1-/);
  assert.doesNotMatch(route, /sk-or-v1-/);
});

test("keeps SearchAPI credentials server-side", async () => {
  const [page, route, envExample, gitignore] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/api/hotels/search/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../.env.example", import.meta.url), "utf8"),
    readFile(new URL("../.gitignore", import.meta.url), "utf8"),
  ]);

  assert.match(page, /fetch\(`\/api\/hotels\/search/);
  assert.match(page, /showMore: "Показать ещё"/);
  assert.match(page, /loadMoreOffers/);
  assert.match(page, /movePhoto/);
  assert.match(page, /photo-arrow/);
  assert.match(route, /https:\/\/www\.searchapi\.io\/api\/v1\/search/);
  assert.match(route, /process\.env\.SEARCHAPI_KEY/);
  assert.match(route, /Authorization: `Bearer \$\{apiKey\}`/);
  assert.match(route, /special_offers/);
  assert.match(route, /price_max/);
  assert.match(route, /next_page_token/);
  assert.match(route, /turkeySearchScopes/);
  assert.match(route, /scopeIndex/);
  assert.match(route, /images,/);
  assert.doesNotMatch(route, /engine: "google_hotels_property"/);
  assert.match(route, /hotelName/);
  assert.match(envExample, /^SEARCHAPI_KEY=$/m);
  assert.match(gitignore, /^\.env\*$/m);
  assert.doesNotMatch(page, /SEARCHAPI_KEY/);
});
