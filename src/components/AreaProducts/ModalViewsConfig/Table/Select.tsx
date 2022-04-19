import makeStyles from "@material-ui/core/styles/makeStyles";
import * as React from "react";
import Btn from "../../../../componentsBase/Btn";
import isEmpty from "lodash-es/isEmpty";
import { IViewDraft, ViewStatus } from "../reducer";
import { IActions } from "../../../../componentsBase/ActionsMenu";
import { getColor } from "../StatusLabel";
import { IProduct } from "../../../../interfaces";

const useStyles = makeStyles(() => ({
  lineThrough: {
    "text-decoration": "line-through",
  },
}));

export interface ISelect {
  fieldKey: string;
  viewDraft: IViewDraft;
  items: IProduct[];
  disabled: boolean;
  onChange: (id: string, value) => void;
}

interface ISelectCmp {
  viewDraft: IViewDraft;
  fieldKey: string;
  variant?: "light" | "bold";
  label: string;
  labelRequired?: boolean;
  tooltip?: string;
  disabled: boolean;
  menu: IActions[];
}

const Select = ({
  viewDraft,
  fieldKey,
  variant,
  label,
  labelRequired,
  tooltip,
  disabled,
  menu,
}: ISelectCmp) => {
  const classes = useStyles({});
  const { status, data } = viewDraft;
  const edited = !isEmpty(data[fieldKey]);
  const labelClassName =
    status === ViewStatus.REMOVE ? classes.lineThrough : "";
  return (
    <Btn
      variant={variant}
      selected={edited}
      color={edited ? getColor(status) : undefined}
      label={label}
      labelClassName={labelClassName}
      labelRequired={labelRequired}
      disabled={disabled}
      tooltip={tooltip}
      menu={{
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "left",
        },
        transformOrigin: {
          vertical: "top",
          horizontal: "left",
        },
        items: menu,
      }}
    />
  );
};

export default Select;
