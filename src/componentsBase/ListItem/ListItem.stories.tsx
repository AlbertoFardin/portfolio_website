import * as React from "react";
import { action } from "@storybook/addon-actions";
import { urlImage } from "../__stories__/mediaUrls";
import ListItem from ".";

const buttons = [
  {
    id: "delete",
    icon: "delete",
  },
  {
    id: "get_app",
    icon: "get_app",
  },
  {
    id: "settings",
    icon: "settings",
  },
  {
    id: "home",
    icon: "home",
  },
];

export default {
  title: "Components/ListItem",
  component: ListItem,
  argTypes: {
    colorTheme: { control: "color" },
  },
  args: {
    style: { border: "1px solid #f00" },
    label: "label",
    onClick: action("onClick"),
    onMouseEnter: action("onMouseEnter"),
    onMouseLeave: action("onMouseLeave"),
  },
};

const Story = (args) => <ListItem {...args} />;

export const Default = Story.bind({});

export const SubLabel = Story.bind({});
SubLabel.args = {
  subLabel: "text text text",
};

export const Ellipsis = Story.bind({});
Ellipsis.args = {
  label:
    "long label long label long label long label long label long label long label long label long label long label long label long label long label long label long label long label long label long label long label long label long label ",
  subLabel:
    "long SUB long SUB long SUB long SUB long SUB long SUB long SUB long SUB long SUB long SUB long SUB long SUB long SUB long SUB long SUB long SUB long SUB long SUB long SUB long SUB long SUB long SUB long SUB long SUB long SUB long SUB long SUB ",
};

export const Active = Story.bind({});
Active.args = {
  active: true,
};

export const Buttons = Story.bind({});
Buttons.args = {
  buttonsEverVisible: true,
  buttons,
};

export const ButtonsLeft = Story.bind({});
ButtonsLeft.args = {
  buttonsLeftEverVisible: true,
  buttonsLeft: buttons,
};

export const Avatar = Story.bind({});
Avatar.args = {
  avatar: urlImage,
};

export const Icon = Story.bind({});
Icon.args = {
  icon: "settings",
};
