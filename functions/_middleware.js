export async function onRequest({ request, next }) {
  const url = new URL(request.url);
  const path = url.pathname;

  // Allow public paths
  if (
    path === "/login" ||
    path.startsWith("/api/login") ||
    path.endsWith(".css") ||
    path.endsWith(".jpg") ||
    path.startsWith("/flower") ||
    path.startsWith("/retrosupply")
  ) {
    const response = await next();
    return addSecurityHeaders(response);
  }

  // Check auth cookie
  const cookie = request.headers.get("Cookie") || "";
  const isAuthed = cookie.includes("portfolio_auth=1");

  if (!isAuthed) {
    return Response.redirect(new URL("/login", request.url), 302);
  }

  // Authenticated → continue
  const response = await next();
  return addSecurityHeaders(response);
}

function addSecurityHeaders(response) {
  const headers = new Headers(response.headers);

  headers.set("X-Frame-Options", "DENY"); // Prevent clickjacking
  headers.set("X-Content-Type-Options", "nosniff"); // Prevent MIME sniffing
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin"); // Control referrer info
  headers.set("Permissions-Policy", "geolocation=(), microphone=(), camera=(), payment=(), usb=()"); // Disable browser features
  headers.set("X-XSS-Protection", "0"); // Basic XSS protection
  headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload"); // Enforce HTTPS
  headers.set("Content-Security-Policy", "default-src 'self'; img-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; frame-ancestors 'none';"
);
 // Content Security Policy
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
