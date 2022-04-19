import * as React from "react";
import { action } from "@storybook/addon-actions";
import FacetTetarea from ".";
import FacetTetareaDemo from "./Demo";

export default {
  title: "Components/Facets/FacetTetarea",
  component: FacetTetarea,
  argTypes: {
    colorTheme: { control: "color" },
  },
  args: {
    colorTheme: "#00f",
    id: "_id",
    label: "FacetTetarea",
    onChange: action("onChange"),
    style: {
      border: "1px solid #f00",
      width: 250,
    },
  },
};

const Story = (args) => <FacetTetarea {...args} />;

export const Default = Story.bind({});

export const Collapsed = Story.bind({});
Collapsed.args = {
  initCollapse: true,
};

export const SubLabel = Story.bind({});
SubLabel.args = {
  subLabel: "subLabel",
};

export const Disabled = Story.bind({});
Disabled.args = {
  disabled: true,
  disabledInfo: "disabledInfo",
};

export const Valued = Story.bind({});
Valued.args = {
  value: "Hi Mom! Look at me!",
};

export const WithSwitch = Story.bind({});
WithSwitch.args = {
  showCaseSensitiveSwitch: true,
};

const StoryDemo = () => <FacetTetareaDemo />;
export const Demo = StoryDemo.bind({});
