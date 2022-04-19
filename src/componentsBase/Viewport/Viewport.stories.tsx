import * as React from "react";
import Viewport from ".";

export default {
  title: "Components/Viewport",
  component: Viewport,
};

const Story = () => (
  <Viewport
    content={
      <div
        style={{ flex: 1, backgroundColor: "red", color: "#fff" }}
        children="CONTENT"
      />
    }
    sidepanel={
      <div
        style={{ flex: 1, backgroundColor: "blue", color: "#fff" }}
        children="SIDEPANEL"
      />
    }
    sidepanelOpen
    sidepanelWidth={290}
    title={
      <div
        style={{ flex: 1, backgroundColor: "lightgray", color: "#fff" }}
        children="TITLE"
      />
    }
    toolbar={
      <div
        style={{ flex: 1, backgroundColor: "pink", color: "#fff" }}
        children="TOOLBAR"
      />
    }
  />
);

export const Example = Story.bind({});
