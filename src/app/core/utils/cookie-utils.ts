// Calcula el dominio wildcard dinámicamente (.ats.com) o retorna undefined si es localhost
export function getSharedDomain(): string | undefined {
  const hostname = window.location.hostname;
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return undefined; // En local no especificamos dominio para que lo asocie a localhost
  }
  const parts = hostname.split('.');
  if (parts.length >= 2) {
    return '.' + parts.slice(-2).join('.');
  }
  return undefined;
}

export function setCookie(name: string, value: string, days?: number, domain?: string): void {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  const domainString = domain ? `; domain=${domain}` : "";
  document.cookie = name + "=" + (value || "") + expires + "; path=/" + domainString + "; SameSite=Lax";
}

export function getCookie(name: string): string | null {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

export function deleteCookie(name: string, domain?: string): void {
  setCookie(name, "", -1, domain);
}
