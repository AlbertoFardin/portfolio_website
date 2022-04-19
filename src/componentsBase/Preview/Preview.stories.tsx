import Btn from "../Btn";
import PreviewType from "./PreviewType";
import * as React from "react";
import { action } from "@storybook/addon-actions";
import Preview from ".";

const urlImage = "./images/original/test_image1.jpeg";
const urlVideo = "./video/width_128/test_video.mp4";
const urlModel = "https://modelviewer.dev/shared-assets/models/Astronaut.glb";

const DemoPreview = (args) => {
  const [mousehover, setMousehover] = React.useState(false);
  const toggleMousehover = React.useCallback(() => setMousehover(!mousehover), [
    mousehover,
  ]);
  return (
    <div style={{ margin: "0 20px" }}>
      <Btn
        color="#00f"
        icon={mousehover ? "check_box" : "check_box_outline_blank"}
        label="mousehover"
        onClick={toggleMousehover}
      />
      <Preview {...args} mousehover={mousehover} />
    </div>
  );
};

export default {
  title: "Components/Preview",
  component: Preview,
  argTypes: {
    colorTheme: { control: "color" },
  },
  args: {
    style: { width: 350, height: 350, border: "1px solid #f00" },
    loading: false,
    onClick: action("onClick"),
    placeholderIcon: "settings",
    placeholderLabel: "settings",
    selected: false,
    colorTheme: "#f00",
  },
};

const Story = (args) => <DemoPreview {...args} />;

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

export const SrcModel = Story.bind({});
SrcModel.args = {
  srcUrl: urlModel,
  srcType: PreviewType.MODEL,
};
