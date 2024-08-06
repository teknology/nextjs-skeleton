import { auth } from "@/auth"
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
export const config = {
    matcher: [
        '/my-account/:path*',
    ]
}

// This function can be marked `async` if using `await` inside
/*
export function middleware(request: NextRequest) {
    return NextResponse.redirect(new URL('/home', request.url))
}
    */

export default auth((req) => {
    if (!req.auth) {
        // console.log(req.auth)
        const newUrl = new URL("/login", req.nextUrl.origin)
        return Response.redirect(newUrl)
    }
})
