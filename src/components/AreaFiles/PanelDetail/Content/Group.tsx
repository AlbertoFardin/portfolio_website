import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Collapse from "@material-ui/core/Collapse";
import ButtonBase from "@material-ui/core/ButtonBase";
import Typography from "@material-ui/core/Typography";
import IconCollapse from "../../../../componentsBase/IconCollapse";

const useStyles = makeStyles(({ mixins }) => ({
  groupHeader: {
    ...mixins.toolbar,
    width: "-webkit-fill-available",
    padding: "0 15px",
  },
  groupHeaderLabel: {
    flex: 1,
    "text-align": "left",
  },
  groupContent: {
    //
  },
}));

interface IGroup {
  title: string;
  content: JSX.Element;
}

const Group = ({ title, content }: IGroup) => {
  const classes = useStyles({});
  const [open, setOpen] = React.useState(true);
  const onOpen = React.useCallback(() => {
    setOpen(!open);
  }, [open]);

  return (
    <>
      <ButtonBase onClick={onOpen} className={classes.groupHeader}>
        <IconCollapse collapse={!open} />
        <Typography
          variant="body2"
          children={title}
          className={classes.groupHeaderLabel}
        />
      </ButtonBase>
      <div className={classes.groupContent}>
        <Collapse in={open} children={content} />
      </div>
    </>
  );
};

export default Group;
