export const IS_PRODUCTION = process.env.NODE_ENV === "production"
export const PORT = process.env.PORT || 8081
export const CLIENT_URL = !IS_PRODUCTION
  ? "http://localhost:3000"
  : "https://what-now.vercel.app"
