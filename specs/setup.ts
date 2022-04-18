import { createServer } from 'vite'

async function globalSetup(): Promise<() => Promise<void>> {
  const server = await createServer({
    server: { port: 3001 }
  })
  await server.listen()
  return async () => {
    server.close().catch(() => {})
  }
}

export default globalSetup
