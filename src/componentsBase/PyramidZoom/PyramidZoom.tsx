import * as React from "react";

import loadable from "@loadable/component";
import Cookies from "js-cookie";

const ReactSeadragon = loadable(() => import("../ReactSeadragon"));

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

export interface IPyramidZoom {
  /** component CSS classes */
  className?: string;
  /** component CSS style */
  style?: React.CSSProperties;
  /** url MCR image, this url must return a firmed url */
  src: string;
  /** prefixUrl passed to ReactSeaddragon component (see OpenSeadragon documentation)*/
  prefixUrl?: string;
  /** showNavigationControl passed to ReactSeaddragon component  (see OpenSeadragon documentation)*/
  showNavigationControl?: boolean;
  /** showFullPageControl passed to ReactSeaddragon component  (see OpenSeadragon documentation)*/
  showFullPageControl?: boolean;
}
/**
 * **PyramidZoom** component which configure ReactSeadragon to work with MCR
 */
const PyramidZoom = ({
  src,
  className,
  style,
  prefixUrl = "",
  showNavigationControl = false,
  showFullPageControl = false,
}: IPyramidZoom) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [tileSources, setTileSources] = React.useState("" as any);

  React.useEffect(() => {
    (async () => {
      if (src) {
        const sourceUrl = src;
        const sourceUrlFirmed = await fetchCookieJwtWithRefreshToken({
          url: sourceUrl,
          method: "GET",
        });

        const xml = await fetch(sourceUrlFirmed, { method: "GET" });
        const xmlText = await xml.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(xmlText, "text/xml");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const docImage = doc.getElementsByTagName("Image")[0] as any;
        const { TileSize, Overlap, Format } = docImage.attributes;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const docSize = doc.getElementsByTagName("Size")[0] as any;
        const { Width, Height } = docSize.attributes;
        setTileSources({
          Image: {
            xmlns: "http://schemas.microsoft.com/deepzoom/2008",
            Url: sourceUrl.replace(
              /([^/]+?)(\.(dzi|xml|js)?(\?[^/]*)?)?\/?$/,
              "$1_files/"
            ),
            Format: Format.value,
            Overlap: Overlap.value,
            TileSize: TileSize.value,
            Size: {
              Height: Height.value,
              Width: Width.value,
            },
          },
        });
      }
    })();
  }, [src]);

  return (
    <ReactSeadragon
      className={className}
      style={style}
      optionsSeadragon={{
        prefixUrl,
        showFullPageControl,
        showNavigationControl,
        crossOriginPolicy: false,
        loadTilesWithAjax: false,
        tileSources,
      }}
    />
  );
};

export default PyramidZoom;
