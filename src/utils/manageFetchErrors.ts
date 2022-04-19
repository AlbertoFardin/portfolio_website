import { logOut } from "../api/fetchCookieJwt";

export const genericErrorText = "Something went wrong, please retry";

interface IManageFetchErrors<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fetch: () => Promise<T>;
  history;
}

const manageFetchErrors = async <T>({
  fetch,
  history,
}: IManageFetchErrors<T>) => {
  try {
    const res = await fetch();
    return res;
  } catch (err) {
    switch (err.status) {
      case 400:
      case 401:
        console.warn("---> Error - unauthorized, so logout: ", err);
        logOut(history);
        break;
      default:
        console.warn("---> Error - generic error", err);
    }
    throw err;
  }
};

export default manageFetchErrors;
