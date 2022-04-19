import * as React from "react";
import * as Colors from "../../../../componentsBase/style/Colors";
import mixColors from "../../../../componentsBase/utils/mixColors";
import {
  ILabel,
  ILabelPositionX,
  ILabelPositionY,
} from "../../../../componentsBase/Field";
import Icon from "@material-ui/core/Icon";
import { colorTheme } from "../../../../constants";
import FieldLabel from "../../../DrawerDetail/FieldLabel";
import LabelCatalog from "./LabelCatalog";

interface IGetProps {
  label: string;
  multiCatalog: boolean;
  multiLanguage: boolean;
  catalogId: string;
  languageId: string;
  isDirty: boolean;
  isReady: boolean;
  isMandatory: boolean;
}

const getProps = ({
  label,
  multiCatalog,
  multiLanguage,
  catalogId,
  languageId,
  isDirty,
  isReady,
  isMandatory,
}: IGetProps): ILabel[] => {
  const array = [] as ILabel[];

  array.push({
    id: "label",
    label: <FieldLabel label={label} mandatory={isMandatory} />,
    positionX: ILabelPositionX.left,
    positionY: ILabelPositionY.top,
    style: {
      maxWidth: 190,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
  });

  array.push({
    id: "catalog",
    positionX: ILabelPositionX.right,
    positionY: ILabelPositionY.top,
    label: (
      <LabelCatalog
        multiCatalog={multiCatalog}
        multiLanguage={multiLanguage}
        catalogId={catalogId}
        languageId={languageId}
      />
    ),
  });

  if (isDirty) {
    array.push({
      id: "dirty",
      label: "Unsaved",
      positionX: ILabelPositionX.right,
      positionY: ILabelPositionY.bottom,
      style: {
        fontStyle: "italic",
        color: colorTheme,
        backgroundColor: mixColors(0.1, "#ffffff", colorTheme),
        padding: "0 5px",
        borderRadius: 2,
      },
    });
  }

  if (isReady) {
    array.push({
      id: "ready",
      label: <Icon style={{ fontSize: 12 }} children="public" />,
      positionX: ILabelPositionX.left,
      positionY: ILabelPositionY.bottom,
      style: {
        bottom: "-22px",
        color: isDirty ? "#aaa" : Colors.Cyan,
      },
    });
  }

  return array;
};

export default getProps;
