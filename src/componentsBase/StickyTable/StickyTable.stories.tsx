import * as React from "react";
import DemoCmp from "./Demo";
import StickyTable from "./StickyTable";

export default {
  title: "Components/Sticky Table",
  component: StickyTable,
};

const Story = () => <DemoCmp />;
export const Demo = Story.bind({});
