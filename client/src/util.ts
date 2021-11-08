export const IS_PRODUCTION = process.env.NODE_ENV !== 'development'
export const SERVER_DOMAIN = !IS_PRODUCTION ? 'localhost:8081' : 'what-now-server.herokuapp.com'
export const SERVER_URL = !IS_PRODUCTION ? `http://${SERVER_DOMAIN}` : `https://${SERVER_DOMAIN}`
export const SOCKET_URL = !IS_PRODUCTION ? `ws://${SERVER_DOMAIN}` : `wss://${SERVER_DOMAIN}`
