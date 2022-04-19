import { TYPE_FOLDER } from "../../constants";
import * as MIMEType from "whatwg-mimetype";

const getFileIcon = (mimeType) => {
  const type = new MIMEType(mimeType).type;
  if (TYPE_FOLDER === mimeType) return "folder";
  if (type === "image") return "image";
  if (type === "video") return "videocam";
  if (type === "application") return "insert_drive_file";
  if (type === "audio") return "music_note";
  if (type === "text") return "code";
  return "warning";
};

export default getFileIcon;
