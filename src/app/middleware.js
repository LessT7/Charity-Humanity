import { NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";

export async function middleware(req) {
  const token = req.cookies.get("token"); // Ambil token dari cookies
  const url = req.nextUrl.clone();

  if (!token) {
    // Redirect ke login jika tidak ada token
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  try {
    const decodedToken = await getAuth().verifyIdToken(token);
    if (!decodedToken.admin) {
      // Redirect jika user bukan admin
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  } catch (err) {
    console.error("Middleware Error:", err);
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next(); // Izinkan akses jika valid
}

export const config = {
  matcher: "/admin/:path*", // Middleware berlaku untuk semua halaman di /admin
};
