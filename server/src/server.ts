import http, { IncomingMessage, OutgoingMessage, ServerResponse } from 'http'

const routes = {
  '/status': function (_req: IncomingMessage, res: ServerResponse) {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.write(JSON.stringify({ ok: 1 }))
    res.end()
  },
  '/translate': function (_req: IncomingMessage, res: ServerResponse) {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.write(JSON.stringify({ code: 'test', route: 'testing' }))
    res.end()
  },
}

const server = http.createServer(function (req, res) {
  const route = routes[req.url as any]
  if (route) {
    route(req, res)
  } else {
    res.writeHead(404, { 'Content-Type': 'text/html' })
    res.write('Not found')
    res.end()
  }
})

export default server
