import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";
import { action } from "@storybook/addon-actions";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import TextField from "@material-ui/core/TextField";
import Btn from "../Btn";
import Conference from "./Conference";
import Cookies from "js-cookie";

const AUTHORIZATION_TOKEN = "warda-authorization";
const REFRESH_TOKEN = "warda-refreshToken";
const AUTH_PATH = "/";
const AUTH_BASE_DOMAIN = ".wardacloud.com";

const SUB = "sub";
const TENANT_ID = "tenantId";
const GROUP_ID = "groupId";

const BASE_URL = "https://api-dev.wardacloud.com";

const fetchCookieJwtWithRefreshToken = async ({
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
      const refreshToken = Cookies.get(REFRESH_TOKEN);
      const body = JSON.stringify({
        refreshToken,
        applicationId: "seecommerce",
        groupId: Cookies.get(GROUP_ID),
        tenantId: Cookies.get(TENANT_ID),
        // NOTE l'api di cognito il campo "userId" corrisponde a al claim "sub" del id token.
        userId: Cookies.get(SUB),
      });
      const response = await fetch(`${BASE_URL}/users/token/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });
      const { status, statusText } = response;

      // TODO: quale sarà il codice di risposta del refresh token
      if (status >= 400) throw { status, statusText, response };
      const res = await response.json();
      const { idToken, expiresIn } = res;

      Cookies.set(AUTHORIZATION_TOKEN, idToken, {
        expires: expiresIn / (60 * 60 * 24),
        path: AUTH_PATH,
        domain: AUTH_BASE_DOMAIN,
        secure: true,
      });

      {
        const response = await fetch(url, {
          ...options,
          credentials: "include",
        });
        const { status, statusText } = response;
        if (status >= 400) throw { status, statusText };
        return await response.json();
      }
    }
    if (status >= 400) throw { status, statusText };
    return await response.json();
  } catch (err) {
    throw err;
  }
};

const users = {
  "auth0|5d80f2bbe202170e126e57c5": {
    id: "auth0|5d80f2bbe202170e126e57c5",
    firstName: "Alberto",
    lastName: "Fardin",
    picture:
      "https://s.gravatar.com/avatar/43ecac9da10d913ef44a522bceef6b6e?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fal.png",
  },
  "auth0|5d80f2cfe202170e126e57e0": {
    id: "auth0|5d80f2cfe202170e126e57e0",
    firstName: "Alberto",
    lastName: "Bisello",
    picture:
      "https://s.gravatar.com/avatar/13b7fadb775b5600c2f1776031349f99?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fal.png",
  },
};
const getUser = (id: string) => {
  if (users[id]) return users[id];
  return {
    id,
    firstName: `${id}_firstName`,
    lastName: `${id}_lastName`,
    picture: `https://loremflickr.com/200/200?random=${id}`,
  };
};
const colorTheme = "#00f";
const useStyles = makeStyles({
  root: {
    position: "relative",
    width: "inherit",
    height: "inherit",
    padding: 20,
    display: "flex",
    "flex-direction": "column",
    "align-items": "center",
    "box-sizing": "border-box",
    overflow: "auto",
  },
  conferenceStart: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    width: "100%",
    "border-bottom": "5px solid #00f",
  },
  conferenceStartLabel: {
    color: "#00f",
    "text-align": "center",
  },
});

const DemoConference = () => {
  const classes = useStyles({});
  const rootRef = React.useRef(null);
  const [simulcast, setSimulcast] = React.useState(true);
  const [conferenceOpen, setConferenceOpen] = React.useState(false);
  const [conferenceStart, setConferenceStart] = React.useState(false);
  const [productId, setProductId] = React.useState("");
  const cbOpen = React.useCallback(() => setConferenceOpen(true), []);
  const toogleSimulcast = React.useCallback(() => {
    setSimulcast(!simulcast);
  }, [simulcast]);
  const cbClose = React.useCallback(() => {
    setConferenceOpen(false);
    action("onClose")();
  }, []);
  const cbSessionDidStart = React.useCallback(() => {
    setConferenceStart(true);
    action("onSessionDidStart")();
  }, []);
  const cbSessionDidStop = React.useCallback(() => {
    setConferenceStart(false);
    action("onSessionDidStop")();
  }, []);
  const cbOnChangeProductId = React.useCallback((event) => {
    setProductId(event.target.value);
    action("cbSetProductId")();
  }, []);
  return (
    <div ref={rootRef} className={classes.root}>
      <Typography variant="body1" style={{ textAlign: "center" }}>
        Questa Demo necessita del cookie di autorizzazione
        <br />
        del ambiente DEV di una applicazione WARDA
      </Typography>
      <FormControlLabel
        control={
          <Checkbox
            checked={simulcast}
            onChange={toogleSimulcast}
            inputProps={{ "aria-label": "primary checkbox" }}
          />
        }
        label="Simulcast"
      />
      <TextField
        label="Product id"
        onChange={cbOnChangeProductId}
        value={productId}
        variant="filled"
      />
      <Btn
        color={colorTheme}
        style={{ padding: "10px 20px", margin: 10 }}
        label="OPEN WEB CONFERENCE"
        disabled={conferenceOpen}
        onClick={cbOpen}
      />
      {!conferenceStart ? null : (
        <div className={classes.conferenceStart}>
          <Typography
            className={classes.conferenceStartLabel}
            variant="body2"
            children=">>> WEBCONFERENCE START <<<"
          />
        </div>
      )}
      <Conference
        baseUrl="https://api-dev.wardacloud.com"
        open={conferenceOpen}
        productId={productId}
        simulcast={simulcast}
        onClose={cbClose}
        onSessionDidStart={cbSessionDidStart}
        onSessionDidStop={cbSessionDidStop}
        getUser={getUser}
        fetchJwt={fetchCookieJwtWithRefreshToken}
      />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <Typography children="--- THIS IS THE END OF THE WEBPAGE ---" />
      <br />
      <br />
      <br />
    </div>
  );
};

export default DemoConference;
