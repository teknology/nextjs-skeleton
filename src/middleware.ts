import { auth } from "@/auth"
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
export const config = {
    matcher: [
        '/my-account/:path*',
    ]
}



export default auth((req) => {
    if (!req.auth) {
        console.log(req.auth)
        const newUrl = new URL("/login", req.nextUrl.origin)
        return Response.redirect(newUrl)
    }
})
