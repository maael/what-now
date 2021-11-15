import * as React from 'react'
import { io, Socket } from 'socket.io-client'
import CardSwiper from '~/components/primitives/CardSwiper'
import { SOCKET_URL } from '~/util'

export default function Game() {
  React.useEffect(() => {
    let socket: Socket
    if (typeof window !== 'undefined') {
      socket = io(SOCKET_URL, { path: '/io' }).connect()
      console.info('connect', socket)
      socket.emit('hey')
      socket.on('connect', () => {
        console.info('connect')
      })
      socket.on('disconnect', () => {
        console.warn('disconnect')
      })
      socket.on('connect_error', (e) => {
        console.error('connect_error', e)
      })
      socket.on('error', () => {
        console.error('error')
      })
      socket.on('message', (d) => {
        console.info('message', d)
      })
    }
    return () => {
      if (socket) {
        socket.disconnect()
      }
    }
  }, [])
  return (
    <main className="flex items-center justify-center h-full max-w-5xl py-5 m-auto">
      <CardSwiper />
    </main>
  )
}
