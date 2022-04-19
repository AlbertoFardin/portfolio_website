import fetch from "node-fetch";
import { CHOOSE_PASSWORD_ID } from "./constants";
import getUrl from "./getUrl";
import * as queryString from "query-string";
import { login } from "./api/fetchCookieJwt";

const tenants = [];

export const activateUser = async ({
  email,
  code,
  groupId,
  password,
  applicationId,
}: {
  email: string;
  code: string;
  groupId: string;
  password: string;
  applicationId: string;
}) => {
  const url = getUrl("/users/token/user/activate");
  const body = {
    email,
    temporaryPassword: code,
    newPassword: password,
    groupId,
  };
  console.log({ body, bodyStringfy: JSON.stringify(body) });

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      temporaryPassword: code,
      newPassword: password,
      groupId,
      applicationId,
    }),
  });
  const result = await res.json();

  if (result.error) {
    throw result.error;
  }

  return result;
};

export const forgotPassword = async ({
  email,
  code,
  groupId,
  password,
  applicationId,
}: {
  email: string;
  code: string;
  groupId: string;
  password: string;
  applicationId: string;
}) => {
  const url = getUrl("/users/confirmForgotPassword");
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      confirmationCode: code,
      newPassword: password,
      groupId,
      applicationId,
    }),
  });
  const result = await res.json();

  if (result.error) {
    throw result.error;
  }

  return result;
};

export const onResetPasswordRequest = async (
  email: string,
  tenant: string,
  cbSuccess: (msgSuccess: string) => void,
  cbFailure: (error: string) => void
) => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      tenantId: tenant,
      applicationId: process.env.PRODUCT_ID,
    }),
  };

  const url = getUrl("/users/forgotPassword");
  const res = await fetch(url, requestOptions);
  const result = await res.json();
  const { error } = result;
  if (error) {
    cbFailure(result.error[0]);
  } else {
    cbSuccess("We've just sent you an email to reset email");
  }
};

export const onLogin = async (
  username: string,
  password: string,
  tenant: string,
  cbFailure: (res) => void,
  history,
  location
) => {
  try {
    await login(username, password, tenant);

    history.push(location.pathname);
  } catch ({ error, code }) {
    if (code === "NEW_PASSWORD_REQUIRED") {
      const params = {
        email: username,
        code: password,
        groupId: tenants.find((t) => t.tenantId === tenant).groupId,
      };
      history.push(
        "/" + CHOOSE_PASSWORD_ID + "?" + queryString.stringify(params)
      );
    }
    cbFailure({ error: String(code) });
  }
};

interface IReturnQueryString {
  email: string;
  username: string;
  groupId: string;
  code: string;
}

// non si usano le funzioni standar di lettura del query string
// per vincoli dati dal servizio di autenticazione Cognito legati all'invio email
export const readQueryString = (location): IReturnQueryString => {
  const { search } = location;
  const query = new URLSearchParams(search);
  const keys = ["email", "groupId", "code"];
  return keys.reduce((acc, key) => {
    const value = query.get(key);
    if (value) acc[key] = value;
    return acc;
  }, {} as IReturnQueryString);
};
