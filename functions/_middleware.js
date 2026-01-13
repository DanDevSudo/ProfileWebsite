export async function onRequest({ request, next }) {
  const url = new URL(request.url)
  const path = url.pathname;
  
  // Allow login page and login handler
  if (url.pathname.startsWith("/login")) {
    return next()
  }

  //allow login styling
  if (
    url.pathname.startsWith("/login") || url.pathname.endsWith(".css") || 
    url.pathname.startsWith("/flower") || url.pathname.endsWith(".jpg") || 
    url.pathname.startsWith("/retrosupply")
    )
  {
    return next()
  }

  if (path.startsWith("/api/login") || path === "/login") {
    return next(); // allow
  }

  // Check for auth cookie
  const cookie = request.headers.get("Cookie") || ""
  const isAuthed = cookie.includes("portfolio_auth=1")

  if (!isAuthed) {
    return Response.redirect(new URL("/login", request.url),302)
  }

  return next()
}
