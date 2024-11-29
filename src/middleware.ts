import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token }) => !!token,
  },
});

export const config = {
  matcher: [
    "/profile/:path*",
    "/dashboard/:path*",
    "/api/protected/:path*",
  ],
};
