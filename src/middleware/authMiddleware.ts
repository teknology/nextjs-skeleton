import { auth } from "@/auth";
import { NextRequest, NextResponse } from 'next/server';

// Define a type for the middleware function
export const config = {
    matcher: [
        '/my-account/:path*',
    ]
}

export const authMiddleware = async (
    request: NextRequest,
    next: () => Promise<NextResponse>
): Promise<NextResponse> => {
    const session = await auth();

    // If no session exists, redirect to the login page
    if (!session) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // If authenticated, proceed to the next middleware or route
    return next();
};