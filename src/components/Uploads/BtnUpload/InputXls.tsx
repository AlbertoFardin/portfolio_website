import isEmpty from "lodash-es/isEmpty";
import * as React from "react";
import InputFile from "../../../componentsBase/InputFile";
import { ACTION_MAIN } from "../../reducer";
import { emptyFn } from "../../../componentsBase/utils/common";
import { ContextDispatchMain } from "../../contexts";

const mimetypesXls = [
  "application/excel",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];
const acceptFiles = mimetypesXls.concat().join();

interface IInputXls {
  importXls: "editor" | "pro";
  onClose: (event: React.MouseEvent) => void;
}

const InputXls = ({ importXls, onClose }: IInputXls) => {
  const dispatchMain = React.useContext(ContextDispatchMain);

  const onChangeInput = React.useCallback(
    (event) => {
      const files = [];
      for (const file of event.target.files) {
        files.push(file);
      }

      if (!isEmpty(files)) {
        dispatchMain({
          type: ACTION_MAIN.UPLOADS_MCR,
          files,
          importXls,
        });
      }

      onClose(event);
    },
    [dispatchMain, importXls, onClose]
  );

  return (
    <InputFile
      acceptFiles={acceptFiles}
      setHover={emptyFn}
      onChangeInput={onChangeInput}
      multiple={true}
      directory={undefined}
    />
  );
};

export default InputXls;
