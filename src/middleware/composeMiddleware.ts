import { NextRequest, NextResponse } from 'next/server';

// Define the type for middleware functions
type Middleware = (
    request: NextRequest,
    next: () => Promise<NextResponse>
) => Promise<NextResponse>;

export const composeMiddleware = (middlewares: Middleware[]) => {
    return async (request: NextRequest): Promise<NextResponse> => {
        let index = -1; // To track the current middleware being executed

        const next = async (): Promise<NextResponse> => {
            index++;

            // If there are no more middlewares, return NextResponse.next()
            if (index >= middlewares.length) {
                return NextResponse.next();
            }

            // Get the current middleware and call it
            const middleware = middlewares[index];
            return middleware(request, next);
        };

        // Start the middleware chain by calling the first middleware
        return next();
    };
};
