import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('token'); // Ambil token dari cookie (atau metode autentikasi Anda)
  
  const url = request.nextUrl.clone();
  
  if (!token && url.pathname === '/Home') {
    // Jika tidak ada token, redirect ke login
    url.pathname = '/auth';
    return NextResponse.redirect(url);
  }
  
  return NextResponse.next();
}
