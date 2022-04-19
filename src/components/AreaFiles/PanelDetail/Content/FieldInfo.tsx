import * as React from "react";
import * as Colors from "../../../../componentsBase/style/Colors";
import {
  ILabel,
  ILabelPositionX,
  ILabelPositionY,
  FieldText,
  FieldDate,
} from "../../../../componentsBase/Field";
import { DATE_FORMAT } from "../../../../componentsBase/StickyGrid";
import { colorTheme, FIELD_WIDTH } from "../../../../constants";
import mixColors from "../../../../componentsBase/utils/mixColors";
import makeStyles from "@material-ui/core/styles/makeStyles";
import classnames from "classnames";
import Btn from "../../../../componentsBase/Btn";
import { DIFFERENT_VALUES } from "../../constants";

const useStyles = makeStyles({
  field: {
    margin: "20px auto",
    width: FIELD_WIDTH,
  },
  fieldDirty: {
    "& > div > fieldset": {
      "border-color": colorTheme + "!important",
    },
  },
  fieldError: {
    "& > div > fieldset": {
      "border-color": Colors.Red + "!important",
    },
  },
});

const getLabel = (label: string, dirty: boolean, error: boolean): ILabel[] => {
  const labels = [] as ILabel[];

  labels.push({
    id: "label",
    label: (error ? "⚠️" : "") + label,
    positionX: ILabelPositionX.left,
    positionY: ILabelPositionY.top,
    style: {
      maxWidth: 300,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
  });

  if (dirty && !error) {
    labels.push({
      id: "dirty",
      label: "Unsaved",
      positionX: ILabelPositionX.right,
      positionY: ILabelPositionY.bottom,
      style: {
        backgroundColor: mixColors(0.1, "#ffffff", colorTheme),
        color: colorTheme,
        fontStyle: "italic",
        padding: "0 5px",
        borderRadius: 2,
      },
    });
  }

  if (error) {
    labels.push({
      id: "error",
      label: "Check value",
      positionX: ILabelPositionX.right,
      positionY: ILabelPositionY.bottom,
      style: {
        backgroundColor: mixColors(0.1, "#ffffff", Colors.Red),
        color: Colors.Red,
        fontStyle: "italic",
        padding: "0 5px",
        borderRadius: 2,
      },
    });
  }

  return labels;
};

const getError = (id: string, value: string): boolean => {
  if (id === "expirationDate") {
    const currentDate = new Date().getTime();
    const writtenDate = new Date(value).getTime();
    return !value ? false : writtenDate < currentDate;
  }
  return false;
};

export enum IFieldType {
  DATE = "DATE",
  TEXTINPUT = "TEXTINPUT",
  TEXTAREA = "TEXTAREA",
}

interface IFieldInfo {
  fieldType: IFieldType;
  fieldId: string;
  fieldLabel: string;
  dataSaved;
  dataDirty;
  onChange: (id: string, value) => void;
}

const FieldInfo = ({
  fieldType,
  fieldId,
  fieldLabel,
  dataSaved,
  dataDirty,
  onChange,
}: IFieldInfo) => {
  const classes = useStyles({});

  const valueSaved = (dataSaved || {})[fieldId];
  const valueDirty = dataDirty[fieldId];
  const dirty = !!Object.keys(dataDirty).find((k) => k === fieldId);

  const value = dirty ? valueDirty : valueSaved;
  const error = getError(fieldId, value);
  const label = getLabel(fieldLabel, dirty, error);
  const className = classnames({
    [classes.field]: true,
    [classes.fieldDirty]: dirty,
    [classes.fieldError]: error,
  });

  const onChangeCb = React.useCallback(
    (value) => {
      onChange(fieldId, value);
    },
    [fieldId, onChange]
  );
  const onClearCb = React.useCallback(() => {
    onChange(fieldId, null);
  }, [fieldId, onChange]);

  const adornmentElement =
    valueSaved === DIFFERENT_VALUES && valueDirty === undefined ? (
      <Btn
        selected
        color={colorTheme}
        icon="close"
        label="Different values saved"
        onClick={onClearCb}
        style={{ margin: 0, minHeight: 32, maxWidth: "inherit" }}
      />
    ) : undefined;

  switch (fieldType) {
    case IFieldType.TEXTINPUT:
      return (
        <FieldText
          className={className}
          label={label}
          value={value}
          onChange={onChangeCb}
          adornmentElement={adornmentElement}
        />
      );
    case IFieldType.TEXTAREA:
      return (
        <FieldText
          className={className}
          label={label}
          value={value}
          multiline
          onChange={onChangeCb}
          adornmentElement={adornmentElement}
        />
      );
    case IFieldType.DATE:
      return (
        <FieldDate
          className={className}
          label={label}
          value={value}
          dateFormat={DATE_FORMAT}
          onChange={onChangeCb}
          adornmentElement={adornmentElement}
        />
      );
  }
};

export default FieldInfo;
