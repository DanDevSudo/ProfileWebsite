export async function onRequestPost({ request, env }) {
  try {
    const { password } = await request.json();
    const hashed = await hashPassword(password, env.SALT);
    if (hashed === env.HASHED_PASSWORD) {
      return new Response("OK", {
        status: 200,
        headers: {
          "Set-Cookie": "portfolio_auth=1; Path=/; HttpOnly; SameSite=Lax",
        },
      });
    }

    return new Response("Unauthorized", { status: 401 });
  } catch (err) {
    console.error("Login handler error:", err);
    return new Response("Internal error", { status: 500 });
  }
}

async function hashPassword(password, salt) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );

  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: encoder.encode(salt), iterations: 100000, hash: "SHA-256" },
    key,
    32 * 8
  );
  return [...new Uint8Array(bits)].map(b => b.toString(16).padStart(2, "0")).join("");
}


