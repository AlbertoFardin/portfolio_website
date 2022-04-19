import * as React from "react";
import * as Colors from "../../../../componentsBase/style/Colors";
import { ILabel } from "../../../../componentsBase/Field";
import { IActions } from "../../../../componentsBase/ActionsMenu";
import { colorTheme } from "../../../../constants";
import Btn from "../../../../componentsBase/Btn";
import getFieldLabels from "./getFieldLabels";

interface IGetProps {
  label: string;
  className: string;
  dirty: boolean;
  multiCatalog: boolean;
  multiLanguage: boolean;
  catalogId: string;
  languageId: string;
  isReady: boolean;
  btnReadyVisibled: boolean;
  btnReadyDisabled: boolean;
  btnResetVisibled: boolean;
  btnResetDisabled: boolean;
  mandatory: boolean;
  placeholderDifferentValues: string;
  onClearValue: () => void;
  readOnly: boolean;
  onReadyClick: () => void;
  onReadyMouseHover: () => void;
  onReadyLabel?: string;
  onResetClick: () => void;
  onResetMouseHover: () => void;
  onResetLabel?: string;
  onMenuClose: () => void;
}

interface IGetPropsReturn {
  label: ILabel[];
  className: string;
  placeholder: string;
  menuOnClose: () => void;
  menuOnHover: boolean;
  menu: IActions[];
  readOnly: boolean;
  adornmentElement: JSX.Element;
}

const getProps = ({
  label,
  className,
  dirty,
  multiCatalog,
  multiLanguage,
  catalogId,
  languageId,
  isReady,
  btnReadyVisibled,
  btnReadyDisabled,
  btnResetVisibled,
  btnResetDisabled,
  mandatory,
  placeholderDifferentValues,
  onClearValue,
  readOnly,
  onReadyClick,
  onReadyMouseHover,
  onReadyLabel = "Ready",
  onResetClick,
  onResetMouseHover,
  onResetLabel = "Reset",
  onMenuClose,
}: IGetProps): IGetPropsReturn => {
  const adornmentElement = !(dirty || !placeholderDifferentValues);
  const menu = [] as IActions[];

  if (btnReadyVisibled) {
    const color = Colors.Cyan;
    menu.push({
      id: "ready",
      label: onReadyLabel,
      icon: "public",
      styleIcon: btnReadyDisabled ? {} : { color },
      disabled: btnReadyDisabled,
      onMouseEnter: btnReadyDisabled ? undefined : onReadyMouseHover,
      onMouseLeave: btnReadyDisabled ? undefined : onMenuClose,
      onClick: onReadyClick,
    });
  }

  if (btnResetVisibled) {
    const color = Colors.Orange;
    menu.push({
      id: "reset",
      label: onResetLabel,
      icon: "settings_backup_restore",
      styleIcon: btnResetDisabled ? {} : { color },
      disabled: btnResetDisabled,
      onMouseEnter: btnResetDisabled ? undefined : onResetMouseHover,
      onMouseLeave: btnResetDisabled ? undefined : onMenuClose,
      onClick: onResetClick,
    });
  }

  return {
    label: getFieldLabels({
      label,
      multiCatalog,
      multiLanguage,
      catalogId,
      languageId,
      isDirty: dirty,
      isReady,
      isMandatory: mandatory,
    }),
    className,
    placeholder: "Input value...",
    menuOnClose: onMenuClose,
    menuOnHover: true,
    menu,
    readOnly,
    adornmentElement: !adornmentElement ? undefined : (
      <Btn
        selected
        color={readOnly ? Colors.Gray1 : colorTheme}
        icon={readOnly ? undefined : "close"}
        label={placeholderDifferentValues}
        onClick={readOnly ? undefined : onClearValue}
        style={{ margin: 0, minHeight: 32, maxWidth: "inherit" }}
      />
    ),
  };
};

export default getProps;
