import { jwtDecode, JwtPayload } from 'jwt-decode';

interface DecodedToken extends JwtPayload {
  user: User;
}

export function storeToken(token: string) {
  document.cookie = `access_token=${token}; path=/; max-age=86400; SameSite=Strict; Secure`;
}

export function getToken(): string | null {
  return document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1") || null;
}

export function removeToken() {
  document.cookie = 'access_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

export function decodeToken(token: string): User | null {
  try {
    const decoded = jwtDecode<User>(token);
    return decoded;

  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}

export function isTokenValid(): boolean {
  const token = getToken();
  if (!token) {
    return false
  }
  else {
    return true
  }
}