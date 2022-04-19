import * as React from "react";
import { action } from "@storybook/addon-actions";
import MultiDownloads from ".";
import {
  urlImage,
  urlImage2,
  urlImage3,
  urlImage4,
} from "../__stories__/mediaUrls";

const items = [
  {
    id: "Bianco",
    name: "Bianco",
    url: urlImage,
    onClick: action("onClick"),
  },
  {
    id: "Grigio",
    name: "Grigio",
    url: urlImage2,
    onClick: action("onClick"),
  },
  {
    id: "Rosso",
    name: "Rosso",
    url: urlImage3,
    onClick: action("onClick"),
  },
  {
    id: "Maculato",
    name: "Maculato",
    url: urlImage4,
    onClick: action("onClick"),
    loading: true,
  },
  {
    id: "Nero",
    name: "Nero",
    url: "",
    onClick: action("onClick"),
    loading: true,
  },
  {
    id: "Tigrato",
    name: "Tigrato",
    url: "",
    onClick: action("onClick"),
    loading: true,
  },
  {
    id: "Marrone",
    name: "Marrone",
    url: "",
    onClick: action("onClick"),
    loading: true,
  },
];

export default {
  title: "Components/MultiDownloads",
  component: MultiDownloads,
  argTypes: {
    colorTheme: { control: "color" },
  },
  args: {
    open: true,
    colorTheme: "#f00",
    onClose: action("onClose"),
    items,
  },
};

const Story = (args) => (
  <div
    style={{
      position: "relative",
      width: "inherit",
      minHeight: 300,
      border: "1px solid #f00",
      boxSizing: "border-box",
    }}
  >
    <MultiDownloads {...args} />
  </div>
);

export const Default = Story.bind({});
