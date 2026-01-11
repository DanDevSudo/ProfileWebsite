export async function onRequestPost({ request, env }) {
  const { password } = await request.json();

  const encoder = new TextEncoder();

  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: encoder.encode(env.SALT),
      iterations: 100000,
      hash: "SHA-256"
    },
    keyMaterial,
    256
  );

  const hash = [...new Uint8Array(derivedBits)]
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");

  if (hash === env.HASHED_PASSWORD) {
    return new Response("OK", {
      status: 200,
      headers: {
        "Set-Cookie": "auth=1; Path=/; HttpOnly; Secure; SameSite=Strict"
      }
    });
  }

  return new Response("Unauthorized", { status: 401 });
}
