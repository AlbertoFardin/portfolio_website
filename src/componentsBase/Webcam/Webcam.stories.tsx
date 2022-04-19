import * as React from "react";
import Webcam from ".";

export default {
  title: "Components/Webcam",
  component: Webcam,
};

const Story = () => (
  <div
    style={{
      margin: 20,
      border: "1px solid #f00",
      backgroundColor: "#f1f1f1",
      width: "fit-content",
      height: "fit-content",
    }}
  >
    <Webcam width={400} height={400} />
  </div>
);

export const Example = Story.bind({});
