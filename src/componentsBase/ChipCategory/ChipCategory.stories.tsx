import * as React from "react";
import { action } from "@storybook/addon-actions";
import ChipCategory from ".";

export default {
  title: "Components/ChipCategory",
  component: ChipCategory,
  argTypes: {
    colorTheme: { control: "color" },
  },
  args: {
    tooltip: "Woman > Shoes > Heels",
    label: "label",
    id: "id",
  },
};

const Story = (args) => <ChipCategory {...args} />;

export const Default = Story.bind({});

export const Ellipsised = Story.bind({});
Ellipsised.args = {
  label: "long label long label long label long label",
};

export const onClick = Story.bind({});
onClick.args = {
  onClick: action("onClick"),
};

export const onRemove = Story.bind({});
onRemove.args = {
  onRemove: action("onRemove"),
};
