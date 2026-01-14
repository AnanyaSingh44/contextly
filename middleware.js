import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",                 // landing page
  "/sign-in(.*)",      // sign-in
  "/sign-up(.*)",      // sign-up
]);

export default clerkMiddleware((auth, req) => {
  if (!isPublicRoute(req)) {
    auth.protect(); // ✅ NEW API
  }
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
