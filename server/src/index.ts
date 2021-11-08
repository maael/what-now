import server from "./server"
import io from "./io"

const PORT = process.env.PORT || 8081
const CLIENT =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://what-now.vercel.app"

io.attach(server, {
  pingInterval: 10000,
  pingTimeout: 5000,
  cookie: false,
  cors: {
    origin: CLIENT,
    methods: ["GET", "POST"],
  },
})

server.listen(PORT)

console.info(`Listening on: http://localhost:${PORT}`)
