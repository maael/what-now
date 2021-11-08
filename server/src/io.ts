import { Server } from 'socket.io'

const io = new Server({ path: '/io', serveClient: false })

io.on('connection', (socket) => {
  console.log('a user connected')
  socket.on('hey', () => {
    console.info('hi')
  })
  socket.send({ message: 'Hello' })
})

export default io
