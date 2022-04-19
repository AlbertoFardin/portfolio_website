import * as React from "react";
import { action } from "@storybook/addon-actions";
import FacetDatePicker from ".";

export default {
  title: "Components/Facets/FacetDatePicker",
  component: FacetDatePicker,
  argTypes: {
    colorTheme: { control: "color" },
  },
  args: {
    colorTheme: "#00f",
    id: "_id",
    label: "FacetDatePicker",
    onChange: action("onChange"),
    style: {
      border: "1px solid #f00",
      width: 250,
    },
    dateFormat: "DD/MM/YYYY",
  },
};

const Story = (args) => <FacetDatePicker {...args} />;

export const Default = Story.bind({});

export const Collapsed = Story.bind({});
Collapsed.args = {
  initCollapse: true,
};

export const Disabled = Story.bind({});
Disabled.args = {
  disabled: true,
};

export const Valued = Story.bind({});
Valued.args = {
  value: {
    startDate: new Date("2017-01-31").getTime(),
    endDate: new Date("2017-03-31").getTime(),
  },
};
