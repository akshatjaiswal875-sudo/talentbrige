import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.SECRET_JWT;
if (!JWT_SECRET || typeof JWT_SECRET !== 'string' || JWT_SECRET.trim() === '') {
    throw new Error('JWT_SECRET_KEY environment variable is not set or is empty.');
}
const secret = new TextEncoder().encode(JWT_SECRET);
async function verifyToken(token: string) {
    try {
        const { payload } = await jwtVerify(token, secret);
        return payload;
    } catch {
        return null;
    }
}


export async function middleware(request: NextRequest) {
    const { method, url, headers } = request;

    const path = request.nextUrl.pathname;

    const token = request.cookies.get('token')?.value;

    const ip =
        headers.get("cf-connecting-ip") || // Cloudflare
        headers.get("x-forwarded-for")?.split(",")[0]?.trim() || // Vercel / proxies
        "unknown";

    const istTime = new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    }).format(new Date());

    console.log(`[${istTime}] ${method} ${url} — IP: ${ip}`);

    // If there's a token, verify it
    let payload: any = null;
    if (token) {
        payload = await verifyToken(token);
    }

    const role = payload?.role ?? payload?.roles ?? null;
    const isAdmin = (typeof role === 'string' && role.toLowerCase() === 'admin') || (Array.isArray(role) && role.includes('admin'));

    // Redirect admin users visiting public pages to /admin
    const isPublicPath = path === '/' || path.startsWith('/internships') || path.startsWith('/companies');
    if (isAdmin && isPublicPath && !path.startsWith('/admin')) {
        return NextResponse.redirect(new URL('/admin', request.url));
    }

    // Redirect non-admin (including unauthenticated) users away from /admin/* to /
    if (path.startsWith('/admin')) {
        if (!isAdmin) {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico).*)',
        // Match all request paths except for:
        // - api (API routes)
        // - _next/static (static files)
        // - _next/image (image optimization files)
        // - favicon.ico, sitemap.xml, robots.txt (metadata files)
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    ],
};