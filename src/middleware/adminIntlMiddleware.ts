// /src/middleware/adminIntlMiddleware.ts

'use server';
import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from '../i18n/routing.public';

// Define the list of admin routes
const adminRoutes = ['/my-account', '/dashboard', '/admin', '/test'];

// Create the intl middleware instance
const intl = createMiddleware(routing);

export const adminIntlMiddleware = async (
    request: NextRequest,
    next: () => Promise<NextResponse>
): Promise<NextResponse> => {
    const pathname = request.nextUrl.pathname;

    // Check if the route is an admin route
    const isAdminRoute = adminRoutes.some(route => pathname === route || pathname.startsWith(`${route}/`));

    // Proceed with the next middleware if it's not an admin route
    let response = await next();

    if (isAdminRoute) {
        // Modify the response headers, not the request headers
        response = new NextResponse(response.body, {
            ...response,
            headers: new Headers(response.headers), // Clone the existing headers
        });
        response.headers.set('x-admin-route', 'true'); // Set the custom header
        return response;
    } else {
        // Handle internationalization using intl middleware
        return Promise.resolve(intl(request));
    }
};
