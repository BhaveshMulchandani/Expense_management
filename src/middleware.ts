export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/expenses/:path*",
    "/budgets/:path*",
    "/analytics/:path*",
    "/admin/:path*",
    "/approvals/:path*",
    "/profile/:path*",
  ],
};
