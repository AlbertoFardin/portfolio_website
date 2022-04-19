/* eslint-disable no-useless-catch */
import isEqual from "lodash-es/isEqual";
import keys from "lodash-es/keys";
import * as queryString from "query-string";

export const emptyFn = () => null;

export const getSignUrl = (urlBackend: string, path: string, type: string) => {
  const objUrlAndQueryString = queryString.parseUrl(urlBackend);
  const baseUrl = objUrlAndQueryString.url;
  const mergeQueryString = {
    filename: path,
    contentType: type,
    ...objUrlAndQueryString.query,
  };
  return `${baseUrl}?${queryString.stringify(mergeQueryString)}`;
};

export const preciseRound = (num: number, dec: number) => {
  const numSign = num >= 0 ? 1 : -1;
  return Number(
    (
      Math.round(num * Math.pow(10, dec) + numSign * 0.0001) / Math.pow(10, dec)
    ).toFixed(dec)
  );
};

export const checkComponentUpdate = (
  prevProps = {},
  nextProps = {},
  prevState = {},
  nextState = {}
) =>
  !!keys(prevProps).find((k) => !isEqual(prevProps[k], nextProps[k])) ||
  !!keys(prevState).find((k) => !isEqual(prevState[k], nextState[k]));

export const COOKIE_JWT_NAME = "warda-authorization";
export const COOKIE_DOMAIN = ".wardacloud.com";
export const COOKIE_PATH = "/";

const getCookie = (cookiename) => {
  // Get name followed by anything except a semicolon
  const cookiestring = RegExp(`${cookiename}[^;]+`).exec(document.cookie);
  // Return everything after the equal sign, or an empty string if the cookie name not found
  return decodeURIComponent(
    cookiestring ? cookiestring.toString().replace(/^[^=]+./, "") : ""
  );
};

export const deleteCookie = (name, domain, path) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:01 GMT;domain=${domain};path=${path}`;
};

const b64DecodeUnicode = (str: string) => {
  // Going backwards: from bytestream, to percent-encoding, to original string.
  return decodeURIComponent(
    atob(str)
      .split("")
      .map((c) => {
        return `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`;
      })
      .join("")
  );
};

export const getProfile = () => {
  try {
    const jwt = getCookie(COOKIE_JWT_NAME);
    const arrayJwtParts = jwt.split(".");
    const payload = arrayJwtParts[1].replace(/-/gi, "+").replace(/_/gi, "/");
    return JSON.parse(b64DecodeUnicode(payload));
  } catch (err) {
    throw err;
  }
};
