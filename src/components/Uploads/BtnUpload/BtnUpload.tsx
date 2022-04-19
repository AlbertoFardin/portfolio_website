import * as React from "react";
import Btn from "../../../componentsBase/Btn";
import { IActions } from "../../../componentsBase/ActionsMenu";
import { MediaType, XlsType } from "../../../interfaces";
import ModalSelectProductMedia from "./ModalUploadMedia";
import { ACTION_MAIN } from "../../reducer";
import InputXls from "./InputXls";
import InputDA from "./InputDA";
import { MAP_UPLOAD_DIRECTORY, ACTIONS_ID } from "../../AreaFiles/actions";
import { FOLDER_ROOT_ID } from "../../../constants";
import { ContextDispatchMain, ContextPermissions } from "../../contexts";
import permissionsCheck from "../../../utils/permissionsCheck";
import PERMISSIONS from "../../../permissions";
import isEmpty from "lodash-es/isEmpty";

const BtnUpload = () => {
  const dispatchMain = React.useContext(ContextDispatchMain);

  const [uploadProduct, setUploadProduct] = React.useState(false);
  const toggleUploadProduct = React.useCallback(() => {
    setUploadProduct(!uploadProduct);
  }, [uploadProduct]);
  const chooseUploadProduct = React.useCallback(
    (files: File[], mediaType: MediaType) => {
      dispatchMain({ type: ACTION_MAIN.UPLOADS_MCR, files, mediaType });
    },
    [dispatchMain]
  );
  const inputXls = React.useCallback(
    ({ id, onClose }) => <InputXls importXls={id} onClose={onClose} />,
    []
  );
  const inputDa = React.useCallback(
    ({ id, onClose }) => (
      <InputDA
        folderId={FOLDER_ROOT_ID}
        onClose={onClose}
        directory={MAP_UPLOAD_DIRECTORY[id]}
      />
    ),
    []
  );
  const permissions = React.useContext(ContextPermissions);
  const menuItems: IActions[] = React.useMemo(() => {
    const actions: IActions[] = [];

    if (
      permissionsCheck({
        keys: [
          PERMISSIONS.seecommerce_manage_post_production_media,
          PERMISSIONS.seecommerce_manage_shooting_media,
        ],
        permissions,
        condition: "OR",
      })
    ) {
      actions.push({
        id: "uploadProduct",
        icon: "image",
        label: "Product media",
        onClick: toggleUploadProduct,
      });
    }

    if (
      permissionsCheck({
        keys: [PERMISSIONS.seecommerce_edit_product_attributes],
        permissions,
      })
    ) {
      actions.push({
        id: XlsType.UPLOAD_XLS_EDITOR,
        icon: "list_alt",
        label: "XLSX",
        getAdditionalChildren: inputXls as () => JSX.Element,
      });
    }

    if (
      permissionsCheck({
        keys: [PERMISSIONS.seecommerce_uploadoad_xlsx_pro],
        permissions,
      })
    ) {
      actions.push({
        id: XlsType.UPLOAD_XLS_PRO,
        icon: "list_alt",
        label: "XLSX PRO",
        getAdditionalChildren: inputXls as () => JSX.Element,
      });
    }

    if (
      permissionsCheck({
        keys: [PERMISSIONS.access_digital_asset_area],
        permissions,
      })
    ) {
      actions.push({
        id: ACTIONS_ID.UPLOAD_FILE,
        icon: "upload_file",
        label: "File in Digital Asset",
        getAdditionalChildren: inputDa as () => JSX.Element,
      });
      actions.push({
        id: ACTIONS_ID.UPLOAD_FOLDER,
        icon: "drive_folder_upload",
        label: "Folder in Digital Asset",
        getAdditionalChildren: inputDa as () => JSX.Element,
      });
    }

    return actions;
  }, [inputDa, inputXls, permissions, toggleUploadProduct]);

  if (isEmpty(menuItems)) return null;

  return (
    <>
      <Btn
        icon="file_upload"
        tooltip="Uploads"
        menu={{
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
          transformOrigin: {
            vertical: "top",
            horizontal: "right",
          },
          items: menuItems,
          title: "Upload",
        }}
      />
      <ModalSelectProductMedia
        open={uploadProduct}
        onClose={toggleUploadProduct}
        onChoose={chooseUploadProduct}
      />
    </>
  );
};

export default BtnUpload;
