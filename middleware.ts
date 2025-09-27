import { authMiddleware } from '@/lib/auth-middleware'
import { type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  return await authMiddleware(request)
}

export const config = {
  matcher: ['/dashboard/:path*', '/decks/:path*', '/study/:path*', '/profile/:path*', '/protected'],
}
