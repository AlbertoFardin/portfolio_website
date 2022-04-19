import { Severity } from "../../../interfaces";
import isEmpty from "lodash-es/isEmpty";
import * as React from "react";
import { emptyFn } from "../../../componentsBase/utils/common";
import InputFile from "../../../componentsBase/InputFile";
import { ACTION_MAIN } from "../../reducer";
import { ContextDispatchMain, ContextSetSnackbar } from "../../contexts";

interface IInputDA {
  folderId: string;
  onClose: (event: React.MouseEvent) => void;
  directory?: string;
}

const InputDA = ({ folderId, onClose, directory }: IInputDA) => {
  const dispatchMain = React.useContext(ContextDispatchMain);
  const setSnackbar = React.useContext(ContextSetSnackbar);

  const onChangeInput = React.useCallback(
    (event) => {
      if (isEmpty(event.target.files)) {
        setSnackbar(Severity.INFO, "No file found in the selected folder");
      } else {
        // NOTE: event.target.files è di tipo FileList NON un array!
        // di seguito riempio un array files.
        const files = [];
        for (const file of event.target.files) {
          files.push(file);
        }
        dispatchMain({
          type: ACTION_MAIN.UPLOADS_DA,
          folderId,
          files,
        });
      }
      onClose(event);
    },
    [dispatchMain, folderId, onClose, setSnackbar]
  );

  return (
    <InputFile
      acceptFiles="*"
      setHover={emptyFn}
      onChangeInput={onChangeInput}
      multiple={true}
      directory={directory}
    />
  );
};

export default InputDA;
