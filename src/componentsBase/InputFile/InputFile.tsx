import * as React from "react";
import { emptyFn } from "../utils/common";
import IInputFile from "./IInputFile";

const style: React.CSSProperties = {
  position: "absolute",
  margin: "auto",
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  width: "100%",
  height: "100%",
  opacity: 0,
  cursor: "pointer",
  outline: "none",
};

const InputFile = ({
  acceptFiles = "*",
  directory,
  multiple = false,
  onChangeInput,
  setHover = emptyFn,
}: IInputFile) => {
  const onClick = React.useCallback((event) => {
    event.stopPropagation();
  }, []);
  const onMouseEnter = React.useCallback(
    (event) => {
      event.stopPropagation();
      setHover(true);
    },
    [setHover]
  );
  const onMouseLeave = React.useCallback(
    (event) => {
      event.stopPropagation();
      setHover(false);
    },
    [setHover]
  );

  return (
    <input
      type={directory ? undefined : "file"}
      accept={acceptFiles}
      {...{
        directory,
        webkitdirectory: directory,
      }}
      multiple={multiple}
      onClick={onClick}
      onChange={onChangeInput}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={style}
    />
  );
};

export default InputFile;
