export const cName = "warda-authorization";

export const setCookie = (cname, cvalue, exdays = 365) => {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  const expires = `expires=${d.toUTCString()}`;
  document.cookie = `${cname}=${cvalue};${expires};path=/`;
};

export const getCookie = (cname) => {
  const name = `${cname}=`;
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
};

export const getCookieBoolean = (cname: string, res = false): boolean => {
  const v = getCookie(cname);
  if (v === "true") return true;
  if (v === "false") return false;
  return res;
};

export const isJwtExpired = (jwt: string) => {
  const payload = JSON.parse(
    atob(jwt.split(".")[1].replace(/-/gi, "+").replace(/_/gi, "/"))
  );
  return Date.now() >= payload.exp * 1000;
};
