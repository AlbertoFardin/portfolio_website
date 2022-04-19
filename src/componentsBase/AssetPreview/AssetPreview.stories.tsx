import * as React from "react";
import { action } from "@storybook/addon-actions";
import Btn from "../Btn";
import { PreviewType } from "../Preview";
import { urlImage, urlVideo } from "../__stories__/mediaUrls";
import AssetPreview from ".";

export default {
  title: "Components/AssetPreview",
  component: AssetPreview,
  argTypes: {
    colorTheme: { control: "color" },
  },
  args: {
    id: "_id",
    style: {
      width: 250,
      height: 295,
    },
    onContextMenu: action("onContextMenu"),
    onClick: action("onClick"),
    onDoubleClick: action("onDoubleClick"),
    label: "Fashion.jpg",
    placeholderIcon: "camera",
    placeholderLabel: "camera",
    colorTheme: "#0000ff",
  },
};

const Story = (args) => <AssetPreview {...args} />;

export const Default = Story.bind({});

export const SrcImage = Story.bind({});
SrcImage.args = {
  srcUrl: urlImage,
  srcType: PreviewType.IMAGE,
};

export const SrcVideo = Story.bind({});
SrcVideo.args = {
  srcUrl: urlVideo,
  srcType: PreviewType.VIDEO,
};

export const Selected = Story.bind({});
Selected.args = {
  selected: true,
};

export const Ellipsised = Story.bind({});
Ellipsised.args = {
  label: "abcdefghilmnopqrstuvz1234567890_abcdefghilmnopqrstuvz1234567890",
  labelProps: { endLength: 6 },
};

export const Customized = Story.bind({});
Customized.args = {
  style: {
    backgroundColor: "#f00",
    width: 250,
    height: 295,
  },
  placeholderIconStyle: { color: "#0f0" },
  placeholderLabelStyle: { color: "#0f0", fontSize: 10 },
  placeholderLabelRequired: true,
  children: (
    <Btn
      icon="link"
      color="#f00"
      style={{ position: "absolute", top: 0, right: 0 }}
    />
  ),
};
