import * as React from "react";
import Typography from "@material-ui/core/Typography";
import ActionsBar from ".";

export default {
  title: "Components/ActionsBar",
  component: ActionsBar,
  args: {
    open: true,
    children: "_ActionsBar",
  },
};

const Story = (args) => (
  <div
    style={{
      height: "inherit",
      display: "flex",
      alignItems: "stretch",
      flexDirection: "column",
      flex: 1,
    }}
  >
    <div style={{ flex: 1 }} />
    <ActionsBar {...args} />
  </div>
);

export const Default = Story.bind({});

export const Customized = Story.bind({});
Customized.args = {
  style: { backgroundColor: "#f1f1f1", borderTop: "1px solid #333" },
  children: (
    <>
      <div style={{ flex: 1 }} />
      <Typography variant="body1" children="Hello 👋" />
      <div style={{ flex: 1 }} />
    </>
  ),
};
