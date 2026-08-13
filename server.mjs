import http from "node:http";
import { spawn } from "node:child_process";

const publicPort = Number(process.env.PUBLIC_PORT || 3000);
const appPort = Number(process.env.VINEXT_PORT || 3001);
const host = "0.0.0.0";
let vinextStatus = "starting";

console.log(`[mareva] Health proxy listening on ${host}:${publicPort}`);
console.log(`[mareva] Starting Vinext on 127.0.0.1:${appPort}`);

const vinext = spawn(
  "node_modules/.bin/vinext",
  ["start", "--hostname", "127.0.0.1", "--port", String(appPort)],
  {
    env: {
      ...process.env,
      PORT: String(appPort),
      WRANGLER_LOG_PATH: ".wrangler/wrangler.log",
    },
    stdio: "inherit",
  },
);

vinext.on("error", (error) => {
  vinextStatus = `error: ${error.message}`;
  console.error(`[mareva] Could not start Vinext: ${error.message}`);
});

vinext.on("exit", (code, signal) => {
  vinextStatus = `exited with code ${code ?? "null"} signal ${signal ?? "null"}`;
  console.error(`[mareva] Vinext exited with code ${code ?? "null"} signal ${signal ?? "null"}`);
});

const server = http.createServer((request, response) => {
  if (request.url === "/health" || request.url === "/healthz" || request.url === "/api/health") {
    response.writeHead(200, {
      "content-type": "application/json",
      "cache-control": "no-store",
    });
    response.end(JSON.stringify({ ok: true, vinext: vinextStatus }));
    return;
  }

  const proxy = http.request(
    {
      hostname: "127.0.0.1",
      port: appPort,
      path: request.url,
      method: request.method,
      headers: request.headers,
    },
    (proxiedResponse) => {
      response.writeHead(proxiedResponse.statusCode || 502, proxiedResponse.headers);
      proxiedResponse.pipe(response);
    },
  );

  proxy.on("error", () => {
    response.writeHead(request.url === "/" ? 200 : 503, {
      "content-type": request.url === "/" ? "text/html; charset=utf-8" : "text/plain; charset=utf-8",
      "cache-control": "no-store",
    });
    response.end(request.url === "/"
      ? "<!doctype html><title>Mareva</title><main style=\"font-family:system-ui;padding:40px\">Mareva is starting. Please refresh in a moment.</main>"
      : "Mareva is starting. Please refresh in a moment.");
  });

  request.pipe(proxy);
});

server.listen(publicPort, host);
