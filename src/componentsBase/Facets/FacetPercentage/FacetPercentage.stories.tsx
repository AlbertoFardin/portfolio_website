import * as React from "react";
import { action } from "@storybook/addon-actions";
import FacetPercentage from ".";
import DemoFacetPercentage from "./Demo";

export default {
  title: "Components/Facets/FacetPercentage",
  component: FacetPercentage,
  argTypes: {
    colorTheme: { control: "color" },
  },
  args: {
    colorTheme: "#00f",
    id: "_id",
    label: "FacetPercentage",
    onChange: action("onChange"),
    style: {
      border: "1px solid #f00",
      width: 250,
    },
    i18n: {
      clear: "clear",
    },
  },
};

const StoryDemo = () => <DemoFacetPercentage />;
export const Demo = StoryDemo.bind({});

const Story = (args) => <FacetPercentage {...args} />;

export const Default = Story.bind({});

export const Collapsed = Story.bind({});
Collapsed.args = {
  initCollapse: true,
};

export const Disabled = Story.bind({});
Disabled.args = {
  disabled: true,
};
