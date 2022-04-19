import * as React from "react";
import { action } from "@storybook/addon-actions";
import FacetMultiSelection, { IItem } from ".";
import DemoFacetMultiSelection from "./Demo";

const value: IItem[] = [
  {
    label: "filter2",
    id: "filter2",
  },
];
const options: IItem[] = [
  {
    label: "filter1",
    id: "filter1",
  },
  {
    label: "filter2",
    id: "filter2",
  },
  {
    label: "filter3",
    id: "filter3",
  },
  {
    label: "filter4",
    id: "filter4",
  },
  {
    label: "filter5",
    id: "filter5",
  },
];

export default {
  title: "Components/Facets/FacetMultiSelection",
  component: FacetMultiSelection,
  argTypes: {
    colorTheme: { control: "color" },
  },
  args: {
    colorTheme: "#00f",
    id: "_id",
    label: "FacetMultiSelection",
    onChange: action("onChange"),
    onSearch: action("onSearch"),
    style: {
      border: "1px solid #f00",
      width: 250,
    },
    value,
    options,
  },
};

const StoryDemo = () => <DemoFacetMultiSelection />;
export const Demo = StoryDemo.bind({});

const Story = (args) => <FacetMultiSelection {...args} />;
export const Default = Story.bind({});

export const Collapsed = Story.bind({});
Collapsed.args = {
  initCollapse: true,
};

export const ValueMax1 = Story.bind({});
ValueMax1.args = {
  valueMax: 1,
};
