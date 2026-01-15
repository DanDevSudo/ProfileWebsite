export async function onRequest({ request, next }) {
  const url = new URL(request.url);
  const path = url.pathname;

  // Allow public paths and static assets
  if (
    path === "/login" ||
    path.startsWith("/api/login") ||
    path.endsWith(".css") ||
    path.endsWith(".jpg") ||
    path.startsWith("/flower") ||
    path.startsWith("/retrosupply")
  ) {
    return next(); // <-- call once
  }

  // Check auth cookie
  const cookie = request.headers.get("Cookie") || "";
  const isAuthed = cookie.includes("portfolio_auth=1");

  if (!isAuthed) {
    return Response.redirect(new URL("/login", request.url), 302);
  }

  // Authenticated → continue
  return next();
}
