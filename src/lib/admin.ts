import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "sitp_admin";
const THIRTY_DAYS = 60 * 60 * 24 * 30;

function adminPassword() {
  return process.env.ADMIN_PASSWORD || null;
}

// The cookie holds an HMAC keyed by the password, so changing ADMIN_PASSWORD
// signs everyone out.
function sessionToken(password: string) {
  return createHmac("sha256", password).update("sitp-admin-session").digest("hex");
}

function safeEqual(a: string, b: string) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return bufA.length === bufB.length && timingSafeEqual(bufA, bufB);
}

export function adminConfigured() {
  return adminPassword() !== null;
}

export async function isAdmin() {
  const password = adminPassword();
  if (!password) return false;
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  return !!token && safeEqual(token, sessionToken(password));
}

export async function signIn(attempt: string) {
  const password = adminPassword();
  if (!password || !safeEqual(attempt, password)) return false;
  (await cookies()).set(COOKIE_NAME, sessionToken(password), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: THIRTY_DAYS,
    path: "/",
  });
  return true;
}

export async function signOut() {
  (await cookies()).delete(COOKIE_NAME);
}
