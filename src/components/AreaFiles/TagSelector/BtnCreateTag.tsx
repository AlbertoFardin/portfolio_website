import * as React from "react";
import { TagType, TagColor, IFileDetail, Severity } from "../../../interfaces";
import Btn from "../../../componentsBase/Btn";
import { addTag, addTagToFilesFolders } from "../../../api/fetchesApi";
import { TYPE_FOLDER } from "../../../constants";
import { ContextSetSnackbar } from "../../contexts";
import { errorSomethingWrong } from "../constants";

interface IBtnCreateTag {
  files: IFileDetail[];
  label: string;
  tagType: TagType;
  tagName?: string;
  onChange: (files: IFileDetail[]) => void;
}
const BtnCreateTag = ({
  files,
  label,
  tagType,
  tagName,
  onChange,
}: IBtnCreateTag) => {
  const setSnackbar = React.useContext(ContextSetSnackbar);
  const color = TagColor[tagType];
  const [hide, setHide] = React.useState(false);
  const [creating, setCreating] = React.useState(false);
  const onClick = React.useCallback(() => {
    setCreating(true);
  }, []);
  const stringfyIds = files.map(({ id }) => id).join();

  // create new tag
  React.useEffect(() => {
    (async () => {
      if (creating) {
        const payload = [];

        try {
          if (files.length === 1) {
            const { id, mimeType } = files[0];
            const newItems = await addTag({
              name: tagName,
              type: tagType,
              ownerId: id,
              ownerIsFolder: mimeType === TYPE_FOLDER,
            });
            newItems.forEach((a) => payload.push(a));
          } else {
            const fileIds = files
              .filter((f) => f.mimeType === TYPE_FOLDER)
              .map((f) => f.id);
            const folderIds = files
              .filter((f) => f.mimeType !== TYPE_FOLDER)
              .map((f) => f.id);
            const newItems = await addTagToFilesFolders({
              name: tagName,
              type: tagType,
              fileIds,
              folderIds,
            });
            newItems.forEach((a) => payload.push(a));
          }
        } catch {
          setSnackbar(Severity.WARNING, errorSomethingWrong);
        }

        setCreating(false);
        setHide(true);
        onChange(payload);
      }
    })();
  }, [creating, files, onChange, setSnackbar, tagName, tagType]);

  // show btn on change items selection or input value
  React.useEffect(() => {
    if (stringfyIds || tagName) setHide(false);
  }, [stringfyIds, tagName]);

  if (hide || !tagName) return null;

  return (
    <Btn
      icon="add_box"
      iconStyle={{ color }}
      color={color}
      tooltip={label}
      onClick={onClick}
      disabled={creating}
    />
  );
};

export default BtnCreateTag;
