import { buildServer } from "./server/server"

const start = async () => {
  const app = await buildServer()
  await app.listen({ port: 9000, host: '0.0.0.0' })
  console.log('🚀 Server running on http://localhost:9000')
}

start()
