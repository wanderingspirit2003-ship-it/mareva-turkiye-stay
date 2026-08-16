import http from "node:http";

const port = Number(process.env.PORT || 3000);
const host = "0.0.0.0";

function handleRequest(request, response) {
  if (request.url === "/health" || request.url === "/healthz" || request.url === "/api/health") {
    response.writeHead(200, {
      "content-type": "application/json",
      "cache-control": "no-store",
    });
    response.end(JSON.stringify({ ok: true, service: "mareva-debug", port }));
    return;
  }

  response.writeHead(200, {
    "content-type": "text/html; charset=utf-8",
    "cache-control": "no-store",
  });
  response.end("<!doctype html><title>Mareva</title><main style=\"font-family:system-ui;padding:40px\"><h1>Mareva is online</h1><p>TimeWeb container responds on port 3000.</p></main>");
}

const server = http.createServer(handleRequest);

server.listen(port, host, () => {
  console.log(`[mareva] Debug server listening on ${host}:${port}`);
});
