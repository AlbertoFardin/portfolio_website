import * as React from "react";
import * as Colors from "../../../componentsBase/style/Colors";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {
  Cell,
  IRenderCellContent,
  IGridRow,
} from "../../../componentsBase/StickyGrid";
import Typography from "@material-ui/core/Typography";
import Tooltip from "../../../componentsBase/Tooltip/Tooltip";
import Icon from "@material-ui/core/Icon";
import classnames from "classnames";
import { EMAIL_KEY, EMAIL_VERIFIED_KEY } from "../constants";

const useStyles = makeStyles({
  icon: {
    "margin-right": 10,
    color: Colors.Gray2,
    "font-size": "20px !important",
  },
  iconVerified: {
    color: Colors.Green,
  },
});

interface ICellEmail {
  cell: IRenderCellContent;
  rows: IGridRow[];
}

const CellEmail = ({ cell, rows }: ICellEmail) => {
  const classes = useStyles({});

  const { rowIndex, style } = cell;
  const rowData = rows[rowIndex].data;

  const email = rowData[EMAIL_KEY];
  const verified = rowData[EMAIL_VERIFIED_KEY];

  return (
    <Cell {...cell} style={{ ...style, justifyContent: "start" }}>
      <Tooltip title={verified ? "Email verified" : "Email not verified"}>
        <Icon
          className={classnames({
            [classes.icon]: true,
            [classes.iconVerified]: verified,
          })}
          children="check_circle"
        />
      </Tooltip>
      <Typography variant="body1" children={email} />
    </Cell>
  );
};

export default CellEmail;
