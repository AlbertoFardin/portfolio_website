import * as React from "react";
import TreeView from "./TreeView";
import items from "./_mockItems.json";
import { action } from "@storybook/addon-actions";
import TreeViewDemoConfigurable from "./DemoConfigurable";
import TreeViewDemoLazyLoading from "./DemoLazyLoading";

export default {
  title: "Components/TreeView",
  component: TreeView,
};

const Story = (args) => <TreeView {...args} />;

export const Default = Story.bind({});
Default.args = {
  expanded: items.map((c) => c.id),
  items,
  onClick: action("onClick"),
  onCheck: action("onCheck"),
  onToggle: action("onToggle"),
};

const DemoStory1 = () => <TreeViewDemoConfigurable />;
export const DemoConfigurable = DemoStory1.bind({});

const DemoStory2 = () => <TreeViewDemoLazyLoading />;
export const DemoLazyLoading = DemoStory2.bind({});
