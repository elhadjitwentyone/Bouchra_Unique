// Authentification admin simple : un mot de passe (ADMIN_PASSWORD, variable d'env Vercel)
// et un cookie de session signé (HMAC-SHA256) valable 7 jours. Compatible middleware Edge.

const COOKIE_NAME = "bu_admin_session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 jours

function secret() {
  const s = process.env.ADMIN_PASSWORD;
  if (!s) throw new Error("ADMIN_PASSWORD n'est pas configuré sur Vercel.");
  return s;
}

async function hmac(data: string, key: string) {
  const enc = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    "raw", enc.encode(key), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", cryptoKey, enc.encode(data));
  return Buffer.from(sig).toString("hex");
}

export async function createSessionToken() {
  const exp = Date.now() + MAX_AGE * 1000;
  const payload = `admin.${exp}`;
  const sig = await hmac(payload, secret());
  return `${payload}.${sig}`;
}

export async function verifySessionToken(token: string | undefined | null) {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [role, exp, sig] = parts;
  if (role !== "admin") return false;
  if (Date.now() > Number(exp)) return false;
  const expected = await hmac(`${role}.${exp}`, secret());
  return expected === sig;
}

export async function checkPassword(input: string) {
  return input === secret();
}

export { COOKIE_NAME, MAX_AGE };
