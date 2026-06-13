import { cookies } from 'next/headers';
const COOKIE = 'sb-access-token';
export async function getAccessToken() { return (await cookies()).get(COOKIE)?.value; }
export async function setSessionCookie(token: string) { (await cookies()).set(COOKIE, token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 60 * 60 * 24 * 7 }); }
export async function clearSessionCookie() { (await cookies()).delete(COOKIE); }
