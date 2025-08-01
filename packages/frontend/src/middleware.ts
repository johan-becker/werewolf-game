import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define public routes that don't require authentication
const publicRoutes = [
  '/',
  '/login',
  '/register',
  '/about',
  '/features',
  '/help',
  '/privacy',
  '/terms',
]

// Define auth routes that should redirect authenticated users
const authRoutes = [
  '/login',
  '/register',
]

// Define protected routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/pack',
  '/territories',
  '/profile',
  '/settings',
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('auth-token')?.value

  // Check if user is authenticated
  const isAuthenticated = !!token

  // Handle auth routes - redirect authenticated users to dashboard
  if (authRoutes.some(route => pathname.startsWith(route))) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.next()
  }

  // Handle protected routes - redirect unauthenticated users to login
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
    return NextResponse.next()
  }

  // Allow public routes
  if (publicRoutes.includes(pathname) || pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  // Default behavior for other routes
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}