import * as React from "react";
import Placeholder from ".";

export default {
  title: "Components/Placeholder",
  component: Placeholder,
  args: {
    icon: "camera",
    label: "CAMERA",
  },
};

const Story = (args) => (
  <div
    style={{
      position: "relative",
      width: "inherit",
      minHeight: 200,
      border: "1px solid #f00",
      boxSizing: "border-box",
    }}
  >
    <Placeholder {...args} />
  </div>
);

export const Default = Story.bind({});

export const Color = Story.bind({});
Color.args = {
  color: "red",
};

export const Label = Story.bind({});
Label.args = {
  icon: "",
};

export const LabelRequired = Story.bind({});
LabelRequired.args = {
  icon: "",
  label: "REQUIRED",
  labelRequired: true,
};

export const Icon = Story.bind({});
Icon.args = {
  label: "",
};

export const Custom = Story.bind({});
Custom.args = {
  icon: "check_circle",
  iconStyle: {
    fontSize: 150,
    color: "yellowgreen",
  },
  label: "Placeholder is OK",
  labelStyle: {
    color: "green",
  },
};
