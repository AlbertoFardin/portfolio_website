import * as React from "react";
import { action } from "@storybook/addon-actions";
import FacetBoolean from ".";
import FacetBooleanDemo from "./Demo";

export default {
  title: "Components/Facets/FacetBoolean",
  component: FacetBoolean,
  argTypes: {
    colorTheme: { control: "color" },
  },
  args: {
    colorTheme: "#00f",
    id: "_id",
    label: "FacetBoolean",
    onChange: action("onChange"),
    style: {
      border: "1px solid #f00",
      width: 250,
    },
    i18n: {
      clear: "clear",
      itemYesLabel: "Yes",
      itemYesCount: 123,
      itemNoLabel: "No",
      itemNoCount: 456,
    },
  },
};

const Story = (args) => <FacetBoolean {...args} />;

export const Default = Story.bind({});

export const Collapsed = Story.bind({});
Collapsed.args = {
  initCollapse: true,
};

export const Disabled = Story.bind({});
Disabled.args = {
  disabled: true,
};

export const ValuedTrue = Story.bind({});
ValuedTrue.args = {
  value: true,
};

export const ValuedFalse = Story.bind({});
ValuedFalse.args = {
  value: false,
};

const StoryDemo = () => <FacetBooleanDemo />;
export const Demo = StoryDemo.bind({});
