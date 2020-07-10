import Cookies from 'universal-cookie';
import { parseDomain } from 'parse-domain';

const cookies = new Cookies();

const TOKEN_NAME = 'myapp-token';
const MAX_AGE = 86400;

const parsedDomain: any = parseDomain(window.location.hostname);
let domain = '';
if (window.location.hostname !== 'localhost' && parsedDomain) {
  domain = `.${parsedDomain.domain}.${parsedDomain.tld}`;
}
if (window.location.hostname === 'localhost') {
  domain = 'localhost';
}

export function setJwtToken(token: string) {
  cookies.set(TOKEN_NAME, token, {
    path: '/',
    domain,
    maxAge: MAX_AGE,
  });
}

export function removeJwtToken() {
  cookies.remove(TOKEN_NAME, { path: '/', domain });
}

export function getJwtToken() {
  return cookies.get(TOKEN_NAME);
}

export default {
  setJwtToken,
  removeJwtToken,
  getJwtToken,
};
