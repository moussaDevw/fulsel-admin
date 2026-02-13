
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { updateSession } from './lib/session'

export async function middleware(request: NextRequest) {
    const session = request.cookies.get('session');

    // Protect admin routes
    if (request.nextUrl.pathname.startsWith('/admin')) {
        if (!session) {
            return NextResponse.redirect(new URL('/auth/login', request.url))
        }
        // Verify session validity (optional here, but can be done)
        // If we want to strictly check validity on every request, we can decode here
        // For now, presence of cookie is the first check, API calls/pages will verify content
    }

    // Redirect to admin if already logged in and visiting login page
    if (request.nextUrl.pathname.startsWith('/auth/login')) {
        if (session) {
            return NextResponse.redirect(new URL('/admin', request.url))
        }
    }

    return await updateSession(request);
}

export const config = {
    matcher: ['/admin/:path*', '/auth/:path*'],
}
