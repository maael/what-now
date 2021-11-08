import http, { IncomingMessage, ServerResponse } from "http"
import { URL } from "url"
import { CLIENT_URL, IS_PRODUCTION } from "./util"

const routes = {
  "/status": function (_req: IncomingMessage, res: ServerResponse) {
    res.writeHead(200, { "Content-Type": "application/json" })
    res.write(JSON.stringify({ ok: 1 }))
    res.end()
  },
  "/translate": function (req: IncomingMessage, res: ServerResponse) {
    const parsedRoute = new URL(req.url || "", `http://${req.headers.host}`)
    const code = parsedRoute.searchParams.get("code")
    res.writeHead(200, { "Content-Type": "application/json" })
    res.write(
      JSON.stringify({
        code,
        route: code,
      })
    )
    res.end()
  },
}

console.info("what", CLIENT_URL, IS_PRODUCTION, process.env.NODE_ENV)

const server = http.createServer(function (req, res) {
  const parsedRoute = new URL(req.url || "", `http://${req.headers.host}`)
  const route = routes[parsedRoute.pathname]
  if (route) {
    res.setHeader("Access-Control-Allow-Origin", CLIENT_URL)
    res.setHeader("Access-Control-Request-Method", "*")
    res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET")
    route(req, res)
  } else {
    res.writeHead(404, { "Content-Type": "text/html" })
    res.write("Not found")
    res.end()
  }
})

export default server
