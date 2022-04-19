import * as React from "react";
import Tooltip from ".";
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles({
  body: {
    position: "relative" as const,
    width: "inherit",
    height: "inherit",
  },
  centerbox: {
    position: "absolute" as const,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    margin: "auto",
    border: "1px solid #00f",
    height: 50,
    width: 100,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  flex1: {
    flex: 1,
  },
});

const TooltipStory = (args) => {
  const classes = useStyles({});
  return (
    <div className={classes.body}>
      <Tooltip {...args}>
        <div className={classes.centerbox}>
          <div className={classes.flex1} />
          <Typography variant="body1" children="Example" />
          <div className={classes.flex1} />
        </div>
      </Tooltip>
    </div>
  );
};

export default {
  title: "Components/Tooltip",
  component: Tooltip,
};

const Story = (args) => <TooltipStory {...args} />;

export const Default = Story.bind({});
Default.args = {
  title: "tooltip",
};

export const Customized = Story.bind({});
Customized.args = {
  title: (
    <>
      <Typography
        style={{ fontWeight: "bold", color: "#fff" }}
        variant="body1"
        children="title  title title"
      />
      <Typography
        style={{ color: "#ccc" }}
        variant="body1"
        children="text text text"
      />
    </>
  ),
};
