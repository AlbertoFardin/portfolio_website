import * as React from "react";
import { action } from "@storybook/addon-actions";
import DatePicker from ".";

export default {
  title: "Components/DatePicker",
  component: DatePicker,
  args: {
    startDate: new Date("2017-03-10").getTime(),
    endDate: new Date("2017-03-23").getTime(),
    onDatesChange: action("onDatesChange"),
    onFocusChange: action("onFocusChange"),
    onOutsideClick: action("onOutsideClick"),
  },
};

const Story = (args) => <DatePicker {...args} />;

export const Default = Story.bind({});

export const SingleDate = Story.bind({});
SingleDate.args = {
  singleDate: true,
  startDate: new Date("2017-03-10").getTime(),
  endDate: null,
};
