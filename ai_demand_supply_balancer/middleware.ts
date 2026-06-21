import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const isAuthPage = request.nextUrl.pathname.startsWith('/admin/login') ||
        request.nextUrl.pathname.startsWith('/admin/signup');
    const isAdminPage = request.nextUrl.pathname.startsWith('/admin');

    // If trying to access admin pages (not login/signup) without a token
    if (isAdminPage && !isAuthPage && !token) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // If trying to access login/signup while already authenticated
    if (isAuthPage && token) {
        return NextResponse.redirect(new URL('/admin', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};
