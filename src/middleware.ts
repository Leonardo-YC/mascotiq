import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// /quiz requiere login: registra mascotas en BD y se vincula al usuario
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/admin(.*)',
  '/quiz(.*)',
]);

const isAdminRoute = createRouteMatcher(['/admin(.*)']);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    const authObject = await auth();

    if (!authObject.userId) {
      return authObject.redirectToSignIn();
    }

    if (isAdminRoute(req)) {
      const userRole = (authObject.sessionClaims?.metadata as { role?: string })?.role;
      if (userRole !== 'admin' && userRole !== 'staff') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    }
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};