import http from "node:http";

const publicPort = Number(process.env.PUBLIC_PORT || 3000);
const host = "0.0.0.0";

console.log(`[mareva] Health proxy listening on ${host}:${publicPort}`);

const server = http.createServer((request, response) => {
  if (request.url === "/health" || request.url === "/healthz" || request.url === "/api/health") {
    response.writeHead(200, {
      "content-type": "application/json",
      "cache-control": "no-store",
    });
    response.end(JSON.stringify({ ok: true, service: "mareva-debug" }));
    return;
  }

  response.writeHead(200, {
    "content-type": "text/html; charset=utf-8",
    "cache-control": "no-store",
  });
  response.end("<!doctype html><title>Mareva</title><main style=\"font-family:system-ui;padding:40px\"><h1>Mareva is online</h1><p>TimeWeb container responds on port 3000.</p></main>");
});

server.listen(publicPort, host);
