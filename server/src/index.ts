import server from './server'
import io from './io'

const PORT = process.env.PORT || 8081

io.attach(server, {
  pingInterval: 10000,
  pingTimeout: 5000,
  cookie: false,
})

server.listen(PORT)

console.info(`Listening on: http://localhost:${PORT}`)
