import { NextResponse } from "next/server";

export function middleware(request) {
	const { pathname } = request.nextUrl;

	// Only enable this during maintenance
	const maintenanceMode = process.env.MAINTENANCE_MODE;

	if (maintenanceMode === "true" && !request.nextUrl.pathname.startsWith("/maintenance")) {
		const url = request.nextUrl.clone();
		url.pathname = "/maintenance";
		return NextResponse.rewrite(url);
	}

	// Check only on /admin route
	if (pathname.startsWith("/admin")) {
		const isAdmin = request.cookies.get("isAdmin")?.value;

		// If not admin, redirect to home
		if (isAdmin !== "true") {
			return NextResponse.redirect(new URL("/", request.url));
		}
	} else if (pathname.startsWith("/login")) {
		const isLoggedIn = request.cookies.get("isLoggedIn")?.value;

		// If admin, redirect to /admin
		if (isLoggedIn === "true") {
			return NextResponse.redirect(new URL("/", request.url));
		}
	} else if (pathname.startsWith("/learn")) {
		const isLoggedIn = request.cookies.get("isLoggedIn")?.value;

		// If not logged in, redirect to /login
		if (!isLoggedIn) {
			return NextResponse.redirect(new URL("/login?reason=auth", request.url));
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/admin/:path*", "/login/:path*", "/learn/:path*"], // Apply only to /admin and its subpaths
};
