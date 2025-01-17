import { authMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default authMiddleware({
  publicRoutes: ["/", "/signin", "/cover-letter"],
  ignoredRoutes: ["/api/webhook"],
  afterSignInUrl: "/profile",

  afterAuth(auth, req) {
    // Handle users who aren't authenticated
    if (!auth.userId && !auth.isPublicRoute) {
      const signInUrl = new URL("/signin", req.url);
      return NextResponse.redirect(signInUrl);
    }

    // print token
    (async () => {
      const token = await auth.getToken();
      console.log("Auth token:", token);
    })();
    return NextResponse.next();
  },
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
    "/",
    "/(api|trpc)(.*)",
  ],
};
