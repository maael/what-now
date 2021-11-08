import server from "./server"
import io from "./io"
import { CLIENT_URL, PORT } from "./util"

io.attach(server, {
  pingInterval: 10000,
  pingTimeout: 5000,
  cookie: false,
  cors: {
    origin: CLIENT_URL,
    methods: ["GET", "POST"],
  },
})

server.listen(PORT)

console.info(`Listening on: http://localhost:${PORT}`)
