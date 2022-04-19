import { ACT_VPORT } from "./reducer";
import isEmpty from "lodash-es/isEmpty";
import last from "lodash-es/last";
import { IFile, IPath, IPermission, SheetLayout } from "../../interfaces";
import { TYPE_FOLDER } from "../../constants";
import { ROOT_MYFILE_ID, ROOT_SHARED_ID } from "./constants";
import PERMISSIONS from "../../permissions";
import permissionsCheck from "../../utils/permissionsCheck";

interface IActioConf {
  id: string;
  icon: string;
  label: string;
  divider?: boolean;
  hidden?: boolean;
  disabled?: boolean;
}
export interface IAction extends IActioConf {
  getAdditionalChildren?: (p) => React.ReactNode;
  onClick: (event: React.MouseEvent, id: string) => void;
}

export const ACTIONS_ID = {
  UPLOAD_FILE: "UPLOAD_FILE",
  UPLOAD_FOLDER: "UPLOAD_FOLDER",
  DETAILS: "DETAILS",
  TAG_ITEM: "TAG_ITEM",
  TAG_MANAGEMENT: "TAG_MANAGEMENT",
  CREATE_FOLDER: "CREATE_FOLDER",
  DELETE: "DELETE",
  RENAME: "RENAME",
  CUT: "CUT",
  PASTE: "PASTE",
  DOWNLOAD_SINGLE: "DOWNLOAD_SINGLE",
  DOWNLOAD_MULTI: "DOWNLOAD_MULTI",
  SHARE_LINK: "SHARE_LINK",
  SHARE_PRIVATE: "SHARE_PRIVATE",
  COPYRIGHT: "COPYRIGHT",
};

interface IGetItemActions {
  contextmenu: boolean;
  permissions: IPermission[];
  detailSheet: SheetLayout;
  path: IPath[];
  items: IFile[];
  itemsIdSelected: string[];
  onClick: (event, id: string) => void;
}
export const getItemActions = ({
  contextmenu,
  detailSheet,
  path,
  items,
  itemsIdSelected,
  permissions,
  onClick,
}: IGetItemActions): IAction[] => {
  if (isEmpty(path)) return [];

  const canDownload = permissionsCheck({
    keys: [PERMISSIONS.digitalassets_download],
    permissions,
  });

  const itemSelected: IFile[] = itemsIdSelected.reduce((acc, id) => {
    const item = items.find((item) => item.id === id);
    if (!!item) acc.push(item);
    return acc;
  }, []);
  const selectedAnyFolders = !!itemSelected.find(({ mimeType }) => {
    return mimeType === TYPE_FOLDER;
  });
  const canSingleDownload = itemsIdSelected.length === 1 && !selectedAnyFolders;
  const canEdit = !itemSelected.find(({ canEdit }) => !canEdit);
  const actions: IActioConf[] = [
    {
      id: ACTIONS_ID.DETAILS,
      icon: "chrome_reader_mode",
      label: "Details",
      hidden: !contextmenu || detailSheet === SheetLayout.OPENED,
    },
    {
      id: ACTIONS_ID.TAG_ITEM,
      icon: "local_offer",
      label: "Tag",
      hidden: !canEdit || detailSheet === SheetLayout.FULLSCREEN,
    },
    {
      id: ACTIONS_ID.DOWNLOAD_MULTI,
      icon: "file_download",
      label: "Download",
      hidden: canSingleDownload,
    },
    {
      id: ACTIONS_ID.DOWNLOAD_SINGLE,
      icon: "file_download",
      label: "Download",
      hidden: !canSingleDownload || !canDownload,
    },
    {
      id: ACTIONS_ID.COPYRIGHT,
      icon: "drive_file_rename_outline",
      label: "Editing Digital Right",
    },
    {
      id: ACTIONS_ID.SHARE_PRIVATE,
      icon: "people_alt",
      label: "Share with",
      divider: true,
    },
    {
      id: ACTIONS_ID.SHARE_LINK,
      icon: "link",
      label: "Get link",
      hidden: itemsIdSelected.length !== 1,
    },
    {
      id: ACTIONS_ID.RENAME,
      icon: "edit",
      label: "Rename",
      divider: true,
      hidden: !canEdit || itemsIdSelected.length !== 1,
    },
    {
      id: ACTIONS_ID.CUT,
      icon: "content_cut",
      label: "Cut",
      hidden:
        !canEdit ||
        detailSheet === SheetLayout.FULLSCREEN ||
        last(path).id === ROOT_SHARED_ID,
    },
    {
      id: ACTIONS_ID.DELETE,
      icon: "delete",
      label: "Delete",
      hidden: !canEdit,
    },
  ];

  return actions
    .filter((a) => !a.hidden)
    .map((a) => ({
      ...a,
      onClick,
    }));
};

interface IGetContentActions {
  cuttedFile: IFile[];
  cuttedPath: string;
  path: IPath[];
  getAdditionalChildren?: (p) => React.ReactNode;
  onClick: (event, id: string) => void;
}
export const getContentActions = ({
  cuttedFile,
  cuttedPath,
  path,
  getAdditionalChildren,
  onClick,
}: IGetContentActions): IAction[] => {
  if (isEmpty(path)) return [];

  const lastPath = last(path);
  const canEdit = lastPath.id === ROOT_MYFILE_ID || lastPath.canEdit;
  const actions: IActioConf[] = [
    {
      id: ACTIONS_ID.CREATE_FOLDER,
      icon: "create_new_folder",
      label: "Create folder",
      hidden: !canEdit,
    },
    {
      id: ACTIONS_ID.UPLOAD_FILE,
      icon: "upload_file",
      label: "Upload file",
      hidden: !canEdit,
    },
    {
      id: ACTIONS_ID.UPLOAD_FOLDER,
      icon: "drive_folder_upload",
      label: "Upload folder",
      hidden: !canEdit,
    },
    {
      id: ACTIONS_ID.TAG_MANAGEMENT,
      icon: "local_offer",
      label: "Tag Management",
    },
    {
      id: ACTIONS_ID.PASTE,
      icon: "file_copy",
      label: "Paste",
      hidden:
        !canEdit ||
        isEmpty(cuttedFile) ||
        lastPath.id === cuttedPath ||
        lastPath.id === ROOT_SHARED_ID,
    },
  ];

  return actions
    .filter((a) => !a.hidden)
    .map((a) => ({
      ...a,
      onClick,
      getAdditionalChildren,
    }));
};

export const MAP_TYPE = {
  [ACTIONS_ID.DETAILS]: ACT_VPORT.DETAILS,
  [ACTIONS_ID.TAG_MANAGEMENT]: ACT_VPORT.TAG_MANAGEMENT,
  [ACTIONS_ID.TAG_ITEM]: ACT_VPORT.MODAL_TAG,
  [ACTIONS_ID.DELETE]: ACT_VPORT.MODAL_DELETE,
  [ACTIONS_ID.RENAME]: ACT_VPORT.MODAL_RENAME,
  [ACTIONS_ID.CUT]: ACT_VPORT.CUTTED,
  [ACTIONS_ID.PASTE]: ACT_VPORT.PASTED,
  [ACTIONS_ID.CREATE_FOLDER]: ACT_VPORT.MODAL_CREATE_FOLDER,
  [ACTIONS_ID.DOWNLOAD_SINGLE]: ACT_VPORT.DOWNLOAD,
  [ACTIONS_ID.DOWNLOAD_MULTI]: ACT_VPORT.DOWNLOAD_FILES,
  [ACTIONS_ID.SHARE_LINK]: ACT_VPORT.MODAL_SHARE_LINK,
  [ACTIONS_ID.SHARE_PRIVATE]: ACT_VPORT.MODAL_SHARE_PRIVATE,
  [ACTIONS_ID.COPYRIGHT]: ACT_VPORT.MODAL_COPYRIGHT,
};

export const MAP_UPLOAD_DIRECTORY = {
  [ACTIONS_ID.UPLOAD_FILE]: undefined,
  [ACTIONS_ID.UPLOAD_FOLDER]: "",
};
