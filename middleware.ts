import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const protectedRoutes = ['/dashboard', '/consultation']
const authRoutes = ['/login', '/register']

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'mbti-secret-key-change-in-production'
)

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('auth_token')?.value

  let isAuthenticated = false
  if (token) {
    try {
      await jwtVerify(token, JWT_SECRET)
      isAuthenticated = true
    } catch {
      isAuthenticated = false
    }
  }

  // Redirect to login if not authenticated and accessing protected route
  if (protectedRoutes.some((route) => pathname.startsWith(route)) && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Redirect to dashboard if authenticated and accessing auth routes
  // But if JWT is invalid (expired/bad), clear the cookie instead
  if (authRoutes.some((route) => pathname.startsWith(route)) && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Clear invalid/stale cookie
  if (token && !isAuthenticated) {
    const res = NextResponse.next()
    res.cookies.set('auth_token', '', { maxAge: 0, path: '/' })
    return res
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/consultation/:path*', '/login', '/register'],
}
