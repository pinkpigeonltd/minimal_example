import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { authentication } from "next-firebase-auth-edge/lib/next/middleware";
import { serverConfig, tokenConfig } from "./config/server-config";

function redirectToLogin(request: NextRequest) {
  if (request.nextUrl.pathname === "/login") {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = "/login";
  url.search = `redirect=${request.nextUrl.pathname}${url.search}`;
  return NextResponse.redirect(url);
}

const commonOptions = {
  ...tokenConfig,
  cookieSerializeOptions: {
    path: "/",
    httpOnly: true,
    secure: serverConfig.useSecureCookies, // Set this to true on HTTPS environments
    sameSite: "lax" as const,
    maxAge: 12 * 60 * 60 * 24 * 1000, // twelve days
  },
};

export async function middleware(request: NextRequest) {
  return authentication(request, {
    loginPath: "/api/login",
    logoutPath: "/api/logout",
    ...commonOptions,
    handleValidToken: async ({}) => {
      if (request.nextUrl.pathname === "/api/custom-claims") {
        const response = new NextResponse("", {
          status: 200,
          headers: { "content-type": "application/json" },
        });

        return response;
      }

      return NextResponse.next();
    },
    handleError: async (error) => {
      // Avoid redirect loop
      if (request.nextUrl.pathname === "/login") {
        return NextResponse.next();
      }

      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.search = `redirect=${request.nextUrl.pathname}${url.search}`;
      return NextResponse.redirect(url);
    },
  });
}

export const config = {
  //note the empty || below, this excludes home from the auth middleware
  matcher: ["/", "/((?!_next/static|favicon.ico|logo.svg).*)"],
};
