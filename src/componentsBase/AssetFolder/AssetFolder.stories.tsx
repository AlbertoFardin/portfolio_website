import * as React from "react";
import { action } from "@storybook/addon-actions";
import Btn from "../Btn";
import AssetFolder from ".";

export default {
  title: "Components/AssetFolder",
  component: AssetFolder,
  argTypes: {
    colorTheme: { control: "color" },
  },
  args: {
    style: {
      width: 200,
      height: 50,
    },
    onContextMenu: action("onContextMenu"),
    onClick: action("onClick"),
    onDoubleClick: action("onDoubleClick"),
    label: "Fashion",
    colorTheme: "#00f",
  },
};

const Story = (args) => <AssetFolder {...args} />;

export const Default = Story.bind({});

export const Selected = Story.bind({});
Selected.args = {
  selected: true,
};

export const Ellipsised = Story.bind({});
Ellipsised.args = {
  label: "abcdefghilmnopqrstuvz1234567890_abcdefghilmnopqrstuvz1234567890",
};

export const Customized = Story.bind({});
Customized.args = {
  style: {
    backgroundColor: "#f00",
    width: 200,
    height: 50,
  },
  children: <Btn icon="link" color="#f00" />,
};
