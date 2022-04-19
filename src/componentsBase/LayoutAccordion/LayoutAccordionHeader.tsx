import * as React from "react";
import { makeStyles } from "@material-ui/core";
import ButtonBase from "@material-ui/core/ButtonBase";

const useStyles = makeStyles(({ palette }) => ({
  accordionHeader: {
    display: "flex",
    "flex-direction": "row",
    "align-items": "stretch",
    color: palette.primary.main,
    width: "-webkit-fill-available",
    overflow: "hidden",
    "text-overflow": "ellipsis",
  },
}));

interface ILayoutAccordionHeader {
  id: string;
  headerNode: React.ReactNode;
  dispatch: React.Dispatch<unknown>;
  expanded: boolean;
  onChange: (id: string, expanded: boolean) => void;
}

const LayoutAccordionHeader = ({
  dispatch,
  id,
  expanded,
  headerNode,
  onChange,
}: ILayoutAccordionHeader) => {
  const classes = useStyles({});
  const onCbClick = React.useCallback(() => {
    dispatch({ id });
    onChange(id, !expanded);
  }, [dispatch, expanded, id, onChange]);
  return (
    <ButtonBase
      className={classes.accordionHeader}
      onClick={onCbClick}
      children={headerNode}
    />
  );
};

export default LayoutAccordionHeader;
