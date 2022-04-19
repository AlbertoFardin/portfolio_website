import Toolbar from "@material-ui/core/Toolbar";
import * as React from "react";
import { action } from "@storybook/addon-actions";
import Pagination from ".";
import DemoPagination from "./Demo";

const pageSizesDefault = [
  {
    label: "1 Rows",
    value: 1,
    selected: false,
  },
  {
    label: "2 Rows",
    value: 2,
    selected: false,
  },
  {
    label: "20 Rows",
    value: 20,
    selected: false,
  },
  {
    label: "50 Rows",
    value: 50,
    selected: true,
  },
  {
    label: "150 Rows",
    value: 150,
    selected: false,
  },
  {
    label: "1000 Rows",
    value: 1000,
    selected: false,
  },
  {
    label: "10000 Rows",
    value: 10000,
    selected: false,
  },
];

export default {
  title: "Components/Pagination",
  component: Pagination,
  argTypes: {
    colorTheme: { control: "color" },
  },
  args: {
    colorTheme: "#f00",
    style: { bottom: "initial", right: "initial" },
    pageCurrent: 5,
    pageSizes: pageSizesDefault,
    itemsCount: 1000,
    onChangeCurrent: action("onChangeCurrent"),
    onChangeSizes: action("onChangeSizes"),
  },
};

const Story = (args) => (
  <Toolbar>
    <Pagination {...args} />
  </Toolbar>
);

export const Default = Story.bind({});

const DemoStory = () => <DemoPagination />;
export const Demo = DemoStory.bind({});

export const LabelAdornmentStart = Story.bind({});
LabelAdornmentStart.args = {
  labelAdornmentStart: "labelAdornmentStart",
};

export const LabelAdornmentEnd = Story.bind({});
LabelAdornmentEnd.args = {
  labelAdornmentEnd: "labelAdornmentEnd",
};

export const Minimized = Story.bind({});
Minimized.args = {
  labelAdornmentStart: "labelAdornmentStart",
  labelAdornmentEnd: "labelAdornmentEnd",
  minimized: true,
};

export const OneSize = Story.bind({});
OneSize.args = {
  pageSizes: 1,
};
