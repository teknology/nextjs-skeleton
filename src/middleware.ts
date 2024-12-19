import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const secureRoute = process.env.NEXT_PUBLIC_ADMIN_SECURE_ROUTE || 'secure';
const adminRoutes = [
    `/admin/${secureRoute}/dashboard`,
    `/admin/${secureRoute}`, // Base admin route
];

export default async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Define the login page dynamically
    const isLoginPage = pathname === `/admin/${secureRoute}/login`;
    const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route)) && !isLoginPage;

    // Redirect to login if accessing a protected admin route without a valid token
    if (isAdminRoute) {
        const token = await getToken({ req, secret: process.env.AUTH_SECRET });
        if (!token) {
            return NextResponse.redirect(new URL(`/admin/${secureRoute}/login`, req.url));
        }
    }

    // Proceed with the request normally if no redirect is triggered
    return NextResponse.next();
}

// General matcher to cover all admin routes
export const config = {
    matcher: ['/admin/:path*'], // General matcher to capture all /admin paths
};