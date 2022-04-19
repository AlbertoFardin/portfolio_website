import makeStyles from "@material-ui/core/styles/makeStyles";
import * as React from "react";
import Btn from "../../../componentsBase/Btn";
import * as Colors from "../../../componentsBase/style/Colors";
import FooterCheckbox from "./FooterCheckbox";

enum LABEL {
  review = "REVIEW",
  ready = "READY",
  checked = "CHECKED",
}
const labelColorMap = {
  [LABEL.review]: Colors.Orange,
  [LABEL.ready]: Colors.Cyan,
  [LABEL.checked]: Colors.Purple,
};
const getLabel = (
  type: LABEL,
  count: number
): { label: JSX.Element | string; color: string } => {
  const item = (c: number) => `item${c > 1 ? "s" : ""}`;
  const color = labelColorMap[type];
  switch (type) {
    case LABEL.review:
      return {
        color,
        label: (
          <>
            <span children={`Skip ${count} ${item(count)} in `} />
            <span style={{ color }} children="REVIEW" />
          </>
        ),
      };
    case LABEL.ready:
      return {
        color,
        label: (
          <>
            <span children={`Skip ${count} `} />
            <span style={{ color }} children="READY" />
            <span children={` ${item(count)}`} />
          </>
        ),
      };
    case LABEL.checked:
      return {
        color,
        label: (
          <>
            <span children={`Only ${count} `} />
            <span style={{ color }} children="CHECKED" />
            <span children={` ${item(count)}`} />
          </>
        ),
      };
    default:
      return {
        color: Colors.Gray3,
        label: "NONE",
      };
  }
};

const useStyles = makeStyles(() => ({
  flex1: {
    flex: 1,
    "min-width": 100,
  },
  footer: {
    padding: 0,
  },
}));

interface IFooter {
  btnItemsCheckedOnToggle: () => void;
  btnItemsCheckedSelected: boolean;
  btnItemsCheckedCount: number;
  //
  btnItemsReviewOnToggle: () => void;
  btnItemsReviewSelected: boolean;
  btnItemsReviewCount: number;
  //
  btnItemsReadyOnToggle: () => void;
  btnItemsReadySelected: boolean;
  btnItemsReadyCount: number;
  //
  itemsToApplyCount: number;
  confirmDisabled: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const Footer = ({
  btnItemsCheckedOnToggle,
  btnItemsCheckedSelected,
  btnItemsCheckedCount,
  btnItemsReviewOnToggle,
  btnItemsReviewSelected,
  btnItemsReviewCount,
  btnItemsReadyOnToggle,
  btnItemsReadySelected,
  btnItemsReadyCount,
  itemsToApplyCount,
  confirmDisabled,
  onConfirm,
  onCancel,
}: IFooter) => {
  const classes = useStyles({});
  return (
    <>
      <FooterCheckbox
        {...getLabel(LABEL.review, btnItemsReviewCount)}
        checked={btnItemsReviewSelected}
        onClick={btnItemsReviewOnToggle}
        tootip="Check to skip item in review"
      />
      <FooterCheckbox
        {...getLabel(LABEL.ready, btnItemsReadyCount)}
        checked={btnItemsReadySelected}
        onClick={btnItemsReadyOnToggle}
        tootip="Check to skip item ready"
      />
      <FooterCheckbox
        {...getLabel(LABEL.checked, btnItemsCheckedCount)}
        checked={btnItemsCheckedSelected}
        onClick={btnItemsCheckedOnToggle}
        tootip="Check to apply only to item checked"
      />
      <div className={classes.flex1} />
      <Btn variant="bold" label="CANCEL" onClick={onCancel} />
      <Btn
        variant="bold"
        color={Colors.Green}
        label="CONFIRM"
        onClick={onConfirm}
        disabled={confirmDisabled}
        tooltip={
          confirmDisabled
            ? "The operation will have no effect, please check your selection"
            : `${itemsToApplyCount} item${
                itemsToApplyCount > 1 ? "s" : ""
              } will be set Ready`
        }
      />
    </>
  );
};

export default Footer;
