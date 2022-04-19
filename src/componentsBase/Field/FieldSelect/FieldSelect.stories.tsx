import { action } from "@storybook/addon-actions";
import * as React from "react";
import DemoFieldSearch from "./DemoFieldSearch";
import DemoFieldSelect from "./DemoFieldSelect";
import DemoFieldBoolean from "./DemoFieldBoolean";
import FieldSelect from ".";
import { style } from "../utils/story";

const valueMany = [];
for (let i = 0; i < 35; i++) {
  const id = `item_${i}`;
  valueMany.push({
    id,
    label: id,
    selected: true,
  });
}

export default {
  title: "Components/Fields/FieldSelect",
  component: FieldSelect,
  args: {
    label: "FieldSelect",
    onChange: action("onChange"),
    style,
    value: [
      {
        id: "apple",
        label: "apple",
        selected: true,
      },
    ],
  },
};

const Story = (args) => <FieldSelect {...args} />;
export const Default = Story.bind({});

export const ItemsMany = Story.bind({});
ItemsMany.args = {
  value: valueMany,
};

export const ItemsGrouped = Story.bind({});
ItemsGrouped.args = {
  itemsGroupedByTitle: true,
  searchable: true,
  options: [
    {
      title: "fruits",
      id: "apple",
      label: "apple",
    },
    {
      title: "vegetables",
      id: "potato",
      label: "potato",
    },
    {
      id: "tomato",
      label: "tomato",
    },
    {
      title: "fruits",
      id: "banana",
      label: "banana",
    },
    {
      id: "ketchup",
      label: "ketchup",
    },
  ],
};

const DemoStorySearch = () => <DemoFieldSearch />;
export const DemoSearch = DemoStorySearch.bind({});

const DemoStorySelect = () => <DemoFieldSelect />;
export const DemoSelect = DemoStorySelect.bind({});

const DemoStoryBoolean = () => <DemoFieldBoolean />;
export const DemoBoolean = DemoStoryBoolean.bind({});
