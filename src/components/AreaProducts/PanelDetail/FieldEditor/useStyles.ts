import makeStyles from "@material-ui/core/styles/makeStyles";
import { FIELD_WIDTH } from "../../../../constants";
import { EditFieldType, IColumnSc } from "../../../../interfaces";
import getFieldHeight from "./getFieldHeight";

interface IStyles {
  column: IColumnSc;
  hightlightColor: string;
}

const boxShadow = (child: boolean, { column, hightlightColor }: IStyles) => {
  try {
    const textarea = column.editField.type === EditFieldType.TextAreaField;
    if ((child && textarea) || (!child && !textarea)) throw "no_hightlight";
    return `0 0 15px 0px ${hightlightColor}`;
  } catch {
    return "none";
  }
};

const useStyles = makeStyles({
  field: {
    height: ({ column }: IStyles) => getFieldHeight(column),
    width: FIELD_WIDTH,
    "background-color": "#fff",
    margin: "25px 5px",
    "box-sizing": "border-box",
    "text-align": "initial",
    "align-self": "center",
  },
  fieldHighlight: {
    "box-shadow": (s: IStyles) => boxShadow(false, s),
    "& > div": {
      "box-shadow": (s: IStyles) => boxShadow(true, s),
    },
  },
});

export default useStyles;
