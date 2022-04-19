import * as React from "react";
import Icon from "@material-ui/core/Icon";
import Toolbar from "@material-ui/core/Toolbar";
import TypographyEllipsis from "../TypographyEllipsis";
import LayoutAccordion from ".";

const IconAdd = () => (
  <Icon children="add" style={{ fontSize: 15, marginRight: 15 }} />
);
const headerStyle = {
  borderBottom: "1px solid #ccc",
  backgroundColor: "#f1f1f1",
  padding: "5px 15px",
  display: "flex",
  width: "-webkit-fill-available",
};
const accordionPanels = [
  {
    id: "1",
    headerNode: (
      <div style={headerStyle}>
        <IconAdd />
        <TypographyEllipsis
          children={
            "Long title Long title Long title Long title Long title Long title" +
            " Long title Long title Long title Long title Long title Long title Long title Long title "
          }
        />
      </div>
    ),
    contentNode: (
      <div>
        <TypographyEllipsis children="contenuto pannello 1" />
      </div>
    ),
  },
  {
    id: "2",
    headerNode: (
      <Toolbar style={headerStyle}>
        <IconAdd />
        <TypographyEllipsis children="Header_2 -- as Toolbar" />
      </Toolbar>
    ),
    contentNode: (
      <Toolbar>
        <TypographyEllipsis children="content_2" />
      </Toolbar>
    ),
  },
  {
    id: "3",
    headerNode: (
      <div
        style={{
          ...headerStyle,
          flexDirection: "column",
          alignItems: "stretch",
        }}
      >
        <Toolbar style={{ padding: 0 }}>
          <IconAdd />
          <TypographyEllipsis children="Header_3 -- as div complex" />
        </Toolbar>
        <Toolbar style={{ padding: 0 }}>
          <div
            style={{ border: "1px solid red", padding: 10, color: "red" }}
            children="CustomComponent"
          />
        </Toolbar>
      </div>
    ),
    contentNode: (
      <div>
        <TypographyEllipsis
          style={{ height: 200 }}
          children="contenuto pannello 3A"
        />
        <TypographyEllipsis
          style={{ height: 200 }}
          children="contenuto pannello 3B"
        />
        <TypographyEllipsis
          style={{ height: 200 }}
          children="contenuto pannello 3C"
        />
        <TypographyEllipsis
          style={{ height: 200 }}
          children="contenuto pannello 3A"
        />
        <TypographyEllipsis children="contenuto pannello 3B" />
        <TypographyEllipsis children="contenuto pannello 3C" />
        <TypographyEllipsis children="contenuto pannello 3A" />
        <TypographyEllipsis children="contenuto pannello 3B" />
        <TypographyEllipsis children="contenuto pannello 3C" />
      </div>
    ),
  },
];

export default {
  title: "Components/LayoutAccordion",
  component: LayoutAccordion,
  args: {
    panels: accordionPanels,
  },
};

const Story = (args) => <LayoutAccordion {...args} />;
export const Default = Story.bind({});
