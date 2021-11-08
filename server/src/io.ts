import { Server } from 'socket.io'

const io = new Server({ path: '/io', serveClient: false })

io.on('connection', (socket) => {
  console.log('a user connected')
  socket.send({ message: 'Hello' })
})

export default io
