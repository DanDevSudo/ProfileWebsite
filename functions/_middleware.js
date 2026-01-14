export async function onRequest({ request, next }) {
  const url = new URL(request.url);
  const path = url.pathname;
  const headers = new Headers(response.headers);

  headers.set("X-Frame-Options", "DENY"); // Prevent clickjacking
  headers.set("X-Content-Type-Options", "nosniff"); // Prevent MIME sniffing
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin"); // Control referrer info
  headers.set("Permissions-Policy", "geolocation=(), microphone=(), camera=(), payment=(), usb=()"); // Disable browser features
  headers.set("X-XSS-Protection", "0"); // Basic XSS protection

  // Allow login page and login handler
  if (url.pathname.startsWith("/login")) {
    return next();
  }

  //allow login styling
  if (
    url.pathname.startsWith("/login") || url.pathname.endsWith(".css") || 
    url.pathname.startsWith("/flower") || url.pathname.endsWith(".jpg") || 
    url.pathname.startsWith("/retrosupply")
    )
  {
    return next();
  }

  if (path.startsWith("/api/login") || path === "/login") {
    return next(); // allow
  }

  // Check for auth cookie
  const cookie = request.headers.get("Cookie") || "";
  const isAuthed = cookie.includes("portfolio_auth=1");

  if (!isAuthed) {
    return Response.redirect(new URL("/login", request.url),302);
  }

  return next();
}
