import { ACTION } from "./reducer";
import { IFileDetail } from "../../interfaces";
import { TYPE_FOLDER } from "../../constants";

export interface IAction {
  id: string;
  icon?: string;
  label: string;
  divider?: boolean;
  hidden?: boolean;
}

const DETAILS = "DETAILS";
const DOWNLOAD_SINGLE = "DOWNLOAD_SINGLE";

interface IGetItemActions {
  contextmenu: boolean;
  detailOpen: boolean;
  items: IFileDetail[];
  itemsIdSelected: string[];
}
export const getItemActions = ({
  contextmenu,
  detailOpen,
  items,
  itemsIdSelected,
}: IGetItemActions): IAction[] => {
  return [
    {
      id: DETAILS,
      icon: "chrome_reader_mode",
      label: "Details",
      hidden: !contextmenu || detailOpen,
    },
    {
      id: DOWNLOAD_SINGLE,
      icon: "file_download",
      label: "Download",
      hidden:
        itemsIdSelected.length !== 1 ||
        !!items.find(({ id, mimeType }: IFileDetail) => {
          const selectionSet = new Set(itemsIdSelected);
          return selectionSet.has(id) && mimeType === TYPE_FOLDER;
        }),
    },
  ].filter((a) => !a.hidden);
};

export const MAP_TYPE = {
  [DETAILS]: ACTION.DETAILS,
  [DOWNLOAD_SINGLE]: ACTION.DOWNLOAD,
};
