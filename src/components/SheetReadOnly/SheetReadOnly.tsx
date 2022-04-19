import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import FieldText from "../../componentsBase/Field/FieldText";
import { FIELD_WIDTH } from "../../constants";
import FieldLabel from "../DrawerDetail/FieldLabel";
import isEmpty from "lodash-es/isEmpty";
import Typography from "@material-ui/core/Typography";
import { IColumnSc } from "../../interfaces";
import { getValueString } from "../../componentsBase/StickyGrid";
import getAttributeKey from "../AreaProducts/getAttributeKey";

interface IStyles {
  fullscreen: boolean;
}
const useStyles = makeStyles({
  sheetcontent: {
    height: "100%",
    flex: 1,
    position: "relative",
    display: "flex",
    "flex-direction": "column",
    "align-items": ({ fullscreen }: IStyles) =>
      fullscreen ? "center" : "stretch",
    "overflow-x": "hidden",
    "overflow-y": "overlay",
    padding: "20px 0",
  },
  field: {
    width: FIELD_WIDTH,
    margin: ({ fullscreen }: IStyles) =>
      fullscreen ? "15px 10px 30px" : "20px auto",
  },
  placeholder: {
    color: "#ccc",
    "text-align": "center",
  },
  flex1: {
    flex: 1,
  },
});

interface ISheetReadOnly {
  assetData;
  columns: IColumnSc[];
  fullscreen?: boolean;
  placeholder?: string;
}

const SheetReadOnly = ({
  assetData,
  columns,
  fullscreen,
  placeholder = "There are no data for this item",
}: ISheetReadOnly) => {
  const classes = useStyles({ fullscreen });
  const fields = columns.map((col) => {
    const { id, label, mandatory } = col;
    const key = getAttributeKey(col, "", "");
    const value = getValueString(assetData[key], col.type);
    return { id, label, mandatory, value };
  });

  return (
    <div className={classes.sheetcontent}>
      {isEmpty(fields) ? (
        <>
          <div className={classes.flex1} />
          <Typography
            className={classes.placeholder}
            variant="body1"
            children={placeholder}
          />
          <div className={classes.flex1} />
        </>
      ) : (
        fields.map(({ id, label, mandatory, value }) => (
          <FieldText
            key={id}
            value={value}
            label={<FieldLabel label={label} mandatory={mandatory} />}
            className={classes.field}
            readOnly
          />
        ))
      )}
    </div>
  );
};

export default SheetReadOnly;
