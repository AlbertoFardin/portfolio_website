import Cookies from "js-cookie";
import {
  AUTHORIZATION_TOKEN,
  AUTH_BASE_DOMAIN,
  AUTH_PATH,
  ENTITYTYPE_CLOSE,
  ENTITYTYPE_VALUE,
  GROUP_ID,
  JWT_KEY,
  REFRESH_TOKEN,
  REFRESH_TOKEN_DURATION_IN_DAYS,
  SUB,
  TENANT_ID,
} from "../constants";
import localstorage from "../componentsBase/utils/isomorphicLocalstorage";
import getUrl from "../getUrl";
import { BASE_URL } from "./endpoints";
import { closeWebSocket } from "../components/webSocket";

export const requestTokenWithRefreshToken = async () => {
  const refreshToken = Cookies.get(REFRESH_TOKEN);
  const body = JSON.stringify({
    refreshToken,
    applicationId: "seecommerce",
    groupId: Cookies.get(GROUP_ID),
    tenantId: Cookies.get(TENANT_ID),
    // nel'api di cognito il campo "userId" corrisponde a al claim "sub" del id token.
    userId: Cookies.get(SUB),
  });
  const response = await fetch(`${BASE_URL}/users/token/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });
  const { status, statusText } = response;

  if (status >= 400) throw { status, statusText, response };
  const res = await response.json();
  const { idToken, expiresIn } = res;

  Cookies.set(AUTHORIZATION_TOKEN, idToken, {
    expires: expiresIn / (60 * 60 * 24),
    path: AUTH_PATH,
    domain: AUTH_BASE_DOMAIN,
    secure: true,
  });
};

/**
 * 
 * https://stackoverflow.com/questions/37442973/cognito-user-pool-how-to-refresh-access-token-using-refresh-token
Qui consigliano di non storare il refresh_token nel browser ma di usare un endpoint:
https://advancedweb.hu/how-to-use-the-refresh-token-with-cognito/

Codice di amazon-cognito-identity-js che utilizza il refresh_token per ottenere un nuovo id_token:

https://github.com/amazon-archives/amazon-cognito-identity-js/blob/f11d39b14d5952c97dbb993ad1390ed70b3300cc/src/CognitoUser.js#L855


TUTTE LE LIBRERIE DI UTILITA' FORNITE DA AMAZON LATO CLIENT NON SI POSSONO USARE....? 
da verificare questa affermazione
 * 
 * @param param0 
 * @returns 
 */
export const fetchCookieJwtWithRefreshToken = async ({
  url,
  method = "GET",
  jsonBody = {},
  additionalHeader = {},
}) => {
  try {
    const headers = {
      ...{ "Content-Type": "application/json" },
      ...additionalHeader,
    };
    const body = JSON.stringify(jsonBody);

    const options =
      method !== "GET" && url !== "HEAD"
        ? {
            method,
            headers,
            body,
          }
        : { method, headers };

    const response = await fetch(url, { ...options, credentials: "include" });
    const { status, statusText } = response;
    if (status === 401) {
      await requestTokenWithRefreshToken();

      {
        const response = await fetch(url, {
          ...options,
          credentials: "include",
        });
        const { status, statusText } = response;
        if (status >= 400) throw { status, statusText, response };
        return await response.json();
      }
    }
    if (status >= 400) throw { status, statusText, response };
    return await response.json();
  } catch (err) {
    throw err;
  }
};

export const login = async (
  username: string,
  password: string,
  tenantId: string
) => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: username,
      password,
      applicationId: process.env.PRODUCT_ID,
      tenantId,
    }),
  };

  const url = getUrl("/users/token/user");
  const res = await fetch(url, requestOptions);
  const result = await res.json();
  const { idToken, refreshToken, expiresIn, error, code } = result;
  if (error) throw { error, code };

  const expiresInDays = expiresIn / (60 * 60 * 24);

  Cookies.set(AUTHORIZATION_TOKEN, idToken, {
    expires: expiresInDays,
    path: AUTH_PATH,
    domain: AUTH_BASE_DOMAIN,
    secure: true,
  });

  Cookies.set(REFRESH_TOKEN, refreshToken, {
    expires: REFRESH_TOKEN_DURATION_IN_DAYS,
    secure: true,
  });

  console.log("[login]");
};

export const logOut = (history) => {
  [JWT_KEY].map((key) => localstorage.removeItem(key));
  [SUB, GROUP_ID, TENANT_ID, ENTITYTYPE_VALUE, ENTITYTYPE_CLOSE].forEach(
    (a) => {
      Cookies.remove(a);
    }
  );
  Cookies.remove(AUTHORIZATION_TOKEN, {
    path: AUTH_PATH,
    domain: AUTH_BASE_DOMAIN,
    secure: true,
  });
  Cookies.remove(REFRESH_TOKEN, { secure: true });
  history.push("/");
  closeWebSocket();
  console.log("[logout]");
};

export const persistenCookieForRefreshToken = ({
  sub,
  groupId,
  tenantId,
}: {
  sub: string;
  groupId: string;
  tenantId: string;
}) => {
  const options = {
    expires: REFRESH_TOKEN_DURATION_IN_DAYS,
  };
  if (!Cookies.get(SUB) && !Cookies.get(GROUP_ID) && !Cookies.get(TENANT_ID)) {
    Cookies.set(SUB, sub, options);
    Cookies.set(GROUP_ID, groupId, options);
    Cookies.set(TENANT_ID, tenantId, options);
  }
};

export const switchTenant = async (
  newTenant: string
): Promise<{
  idToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}> => {
  const refreshToken = Cookies.get(REFRESH_TOKEN);
  const body = JSON.stringify({
    refreshToken,
    tenantId: newTenant,
    applicationId: "seecommerce",
  });
  const response = await fetch(`${BASE_URL}/users/user/tenant/switch`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body,
  });

  const res: {
    idToken: string;
    refreshToken: string;
    expiresIn: number;
    tokenType: string;
  } = await response.json();

  Cookies.set(AUTHORIZATION_TOKEN, res.idToken, {
    expires: res.expiresIn / (60 * 60 * 24),
    path: AUTH_PATH,
    domain: AUTH_BASE_DOMAIN,
    secure: true,
  });
  Cookies.set(TENANT_ID, newTenant, {
    expires: REFRESH_TOKEN_DURATION_IN_DAYS,
  });

  return res;
};
