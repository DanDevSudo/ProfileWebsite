export async function onRequest({ request, next }) {
  const url = new URL(request.url)

  // Allow login page and login handler
  if (url.pathname.startsWith("/login")) {
    return next()
  }

  // Check for auth cookie
  const cookie = request.headers.get("Cookie") || ""
  const isAuthed = cookie.includes("portfolio_auth=1")

  if (!isAuthed) {
    return Response.redirect(
      new URL("/login", request.url),
      302
    )
  }

  return next()
}
