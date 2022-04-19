import * as React from "react";
import DemoSkeleton from "./Demo";
import Skeleton from "./Skeleton";

export default {
  title: "Components/Skeleton",
  component: Skeleton,
};

const Story = () => <Skeleton />;

export const Default = Story.bind({});

const DemoStory = () => <DemoSkeleton />;
export const Demo = DemoStory.bind({});
