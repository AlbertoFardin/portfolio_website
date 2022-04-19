import * as React from "react";
import PaperFold from ".";
import DemoPaperFold from "./Demo";

export default {
  title: "Components/PaperFold",
  component: PaperFold,
  args: {
    size: 15,
    open: true,
    anchorVertical: "top",
    anchorHorizontal: "left",
    color: "#f7f7f7",
  },
};

const Story = (args) => <PaperFold {...args} />;
export const Default = Story.bind({});

const DemoStory = () => <DemoPaperFold />;
export const Demo = DemoStory.bind({});
