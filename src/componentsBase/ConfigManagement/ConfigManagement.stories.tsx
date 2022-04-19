import * as React from "react";
import { action } from "@storybook/addon-actions";
import * as ConfigManagement_MoreItems from "./mockConfigManagementMoreItems.json";
import ConfigManagement from "./";

export default {
  title: "Components/ConfigManagement",
  component: ConfigManagement,
  args: {
    open: true,
    onChange: action("onChange"),
    onClose: action("onClose"),
    items: [
      { id: "1", label: "1", groupId: "1" },
      { id: "2", label: "2", groupId: "1" },
      { id: "3", label: "3", groupId: "1" },
      { id: "4", label: "4", groupId: "2" },
      { id: "5", label: "5", groupId: "2" },
    ],
    itemsSets: [
      {
        id: "1",
        label: "Set di Default",
        active: true,
        items: [{ id: "1" }],
        default: true,
      },
      {
        id: "2",
        label: "Set2",
        active: false,
        items: [{ id: "1" }, { id: "2" }],
      },
    ],
    itemsGroups: [
      { id: "1", label: "1" },
      { id: "2", label: "2" },
    ],
  },
};

const Story = (args) => (
  <div
    style={{
      position: "relative",
      width: "inherit",
      minHeight: 400,
      border: "1px solid #f00",
      boxSizing: "border-box",
    }}
  >
    <ConfigManagement {...args} />
  </div>
);

export const Default = Story.bind({});

export const Disabled = Story.bind({});
Disabled.args = {
  disabled: true,
};

export const MoreItems = Story.bind({});
MoreItems.args = ConfigManagement_MoreItems;

export const NoItems = Story.bind({});
NoItems.args = {
  items: [],
};

export const NoItemsSets = Story.bind({});
NoItemsSets.args = {
  itemsSets: [],
};

export const NoItemsGroups = Story.bind({});
NoItemsGroups.args = {
  itemsGroups: [],
};
