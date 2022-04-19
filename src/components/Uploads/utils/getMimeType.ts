import * as dizExtensions from "../extensions.json";

export const OCTET_STREAM_MIMETYPE = "application/octet-stream";

const getMimeType = (name: string) => {
  const res = name.match(/\.([0-9a-z]+)(?:[\?#]|$)/i);
  return (
    (res
      ? dizExtensions[res[1].toLowerCase()]
        ? dizExtensions[res[1].toLowerCase()].mime
        : undefined
      : null) || OCTET_STREAM_MIMETYPE
  );
};

export default getMimeType;
