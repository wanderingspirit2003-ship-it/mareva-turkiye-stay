import http from "node:http";
import { spawn } from "node:child_process";

const primaryPort = Number(process.env.PORT || 80);
const fallbackPort = Number(process.env.FALLBACK_PORT || 0);
const appPort = Number(process.env.VINEXT_PORT || 3001);
const host = "0.0.0.0";
let appStatus = "starting";

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

vinext.on("spawn", () => {
  appStatus = "running";
});

vinext.on("error", (error) => {
  appStatus = `error: ${error.message}`;
  console.error(`[mareva] Could not start Vinext: ${error.message}`);
});

vinext.on("exit", (code, signal) => {
  appStatus = `exited with code ${code ?? "null"} signal ${signal ?? "null"}`;
  console.error(`[mareva] Vinext exited with code ${code ?? "null"} signal ${signal ?? "null"}`);
});

function handleRequest(request, response) {
  if (request.url === "/health" || request.url === "/healthz" || request.url === "/api/health") {
    response.writeHead(200, {
      "content-type": "application/json",
      "cache-control": "no-store",
    });
    response.end(JSON.stringify({ ok: true, service: "mareva", app: appStatus, port: request.socket.localPort }));
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
    response.end(
      request.url === "/"
        ? "<!doctype html><title>Mareva</title><main style=\"font-family:system-ui;padding:40px\"><h1>Mareva is starting</h1><p>Please refresh in a moment.</p></main>"
        : "Mareva is starting. Please refresh in a moment.",
    );
  });

  request.pipe(proxy);
}

const ports = [...new Set([primaryPort, fallbackPort].filter((port) => port > 0))];

for (const port of ports) {
  const server = http.createServer(handleRequest);
  server.listen(port, host, () => {
    console.log(`[mareva] Public server listening on ${host}:${port}`);
  });
}
