// /app/middleware.ts

'use server';
import { NextRequest } from 'next/server';
import { adminIntlMiddleware } from './middleware/adminIntlMiddleware'; // Import the combined middleware
import { authMiddleware } from './middleware/authMiddleware'; // Import authMiddleware
import { composeMiddleware } from './middleware/composeMiddleware'; // Import composeMiddleware

// Main middleware function that chains the middlewares
export default async function middleware(request: NextRequest) {
    // Compose and apply the middlewares
    return composeMiddleware([authMiddleware, adminIntlMiddleware])(request);
}

export const config = {
    matcher: [
        '/',
        '/(de|en)/:path*',
        '/my-account/:path*',
        '/dashboard/:path*',
        '/test/:path*',
        '/admin/:path*',
    ],
};
