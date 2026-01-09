export async function onRequest(context) {
  const { request, next, env } = context;

  // 1. Get credentials from the browser login popup
  const authHeader = request.headers.get("Authorization");
  if (!authHeader) {
    return new Response("Unauthorized", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Secure Portfolio"' },
    });
  }

  // 2. Decode the password from the header
  const base64 = authHeader.split(" ")[1];
  const [_user, passwordAttempt] = atob(base64).split(":");

  // 3. Re-calculate the hash using the Web Crypto API
  const isValid = await verifyPBKDF2(
    passwordAttempt, 
    env.HASHED_PASSWORD, 
    env.SALT
  );

  if (isValid) {
    return await next();
  }

  return new Response("Forbidden: Invalid Password", { status: 403 });
}

async function verifyPBKDF2(password, storedHex, salt) {
  const encoder = new TextEncoder();
  
  // Import the password attempt as a key
  const passwordKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );

  // Run the 100,000 iterations
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: encoder.encode(salt),
      iterations: 100000,
      hash: "SHA-256",
    },
    passwordKey,
    256 // 32 bytes * 8 bits
  );

  // Convert the result to Hex to compare with your stored string
  const derivedHex = Array.from(new Uint8Array(derivedBits))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  return derivedHex === storedHex;
}