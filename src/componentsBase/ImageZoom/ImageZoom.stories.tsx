import * as React from "react";
import {
  urlImage,
  urlImage2,
  urlImage3,
  urlImage4,
} from "../__stories__/mediaUrls";
import ImageZoom from ".";

export default {
  title: "Components/ImageZoom",
  component: ImageZoom,
  args: {
    images: [urlImage, urlImage2, urlImage3, urlImage4],
  },
};

const Story = (args) => <ImageZoom {...args} />;
export const Default = Story.bind({});
