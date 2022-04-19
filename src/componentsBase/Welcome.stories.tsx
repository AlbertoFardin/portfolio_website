import * as React from "react";
import LogoWarda from "./LogoWarda";
import { version } from "../../version.json";
import Background from "../components/Background";

const Story = () => {
  localStorage.clear();
  return (
    <div style={{ height: "100%", width: "100%" }}>
      <Background />
      <div
        style={{
          height: 90,
          textAlign: "center",
          color: "#fff",
          margin: "auto",
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        }}
      >
        <LogoWarda height={90} width={200} color="#fff" />
        <p
          style={{ fontFamily: "monospace", letterSpacing: 3 }}
          children={`SeeCommerce-UI ${version}`}
        />
      </div>
    </div>
  );
};

export default { title: `Intro/SeecommerceUI ${version}` };
export const Welcome = Story.bind({});
