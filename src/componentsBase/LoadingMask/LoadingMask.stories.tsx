import * as React from "react";
import LoadingMask from ".";

export default {
  title: "Components/LoadingMask",
  component: LoadingMask,
  args: {
    open: true,
  },
};

const Story = (args) => <LoadingMask {...args} />;

export const Default = Story.bind({});

export const CustomColors = Story.bind({});
CustomColors.args = {
  backgroundColor: "#00f",
  spinnerColor: "#fff",
};
