import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@/auth"

export default auth((req) => {
    const slug = req.url;

    console.log(req.auth);
});