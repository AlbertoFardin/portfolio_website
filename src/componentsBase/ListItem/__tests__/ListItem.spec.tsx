/* eslint-disable react/jsx-props-no-spreading */
import { shallow } from "enzyme";
import * as React from "react";
import Component from "../ListItem";
import createTheme from "../../theme/getMuiTheme";

function setup(config = {}) {
  const props = {
    id: "_id",
    label: "_label",
    onClick: () => console.log("onClick"),
    active: false,
    buttons: [],
    buttonsEverVisible: false,
    disabled: false,
    onClose: () => console.log("onClose"),
    colorTheme: "#ffbb66",
    classes: {
      root: "root",
      button: "button",
      visible: "visible",
      label: "label",
      labelContainer: "labelContainer",
    },
    subLabel: "subLabel",
    ...config,
  };
  const muiTheme = createTheme({});
  const shallowWithContext = (node) => shallow(node, { context: { muiTheme } });
  const cmp = shallowWithContext(<Component {...props} />);
  return {
    props,
    cmp,
  };
}

describe("ListItem", () => {
  test("default", () => {
    const { cmp: cmpRoot, props } = setup();
    const cmp = cmpRoot.childAt(0);
    const labelContainer = cmp.childAt(0);
    const label = labelContainer.childAt(0).childAt(0).childAt(0);
    const subLabel = labelContainer.childAt(0).childAt(0).childAt(1);

    expect(cmp.name()).toEqual("WithStyles(ForwardRef(ListItem))");
    expect(cmp.name()).toEqual("WithStyles(ForwardRef(ListItem))");
    expect(cmp.prop("button")).toEqual(true);
    expect(labelContainer.length).toEqual(1);
    expect(labelContainer.name()).toEqual("div");
    expect(labelContainer.prop("className")).toMatch(
      props.classes.labelContainer
    );
    expect(labelContainer.children().length).toEqual(1);
    expect(label.name()).toEqual("WithStyles(ForwardRef(Typography))");
    expect(label.props().children).toEqual(props.label);
    expect(subLabel.name()).toEqual("WithStyles(ForwardRef(Typography))");
    expect(subLabel.prop("children")).toEqual(props.subLabel);
  });

  test("copyToClipboard", () => {
    const { cmp } = setup({
      copyToClipboard: "ciao",
    });
    expect(cmp.name()).toEqual("CopyToClipboard");
    expect(cmp.prop("text")).toEqual("ciao");
  });

  test("active", () => {
    const { cmp: cmpRoot } = setup({
      active: true,
    });
    const cmp = cmpRoot.childAt(0);
    const label = cmp.childAt(0).childAt(0).childAt(0).childAt(0);
    expect(label.prop("variant")).toEqual("subtitle2");
  });

  test("buttons", () => {
    const { cmp: cmpRoot, props } = setup({
      buttons: [
        {
          id: "a",
          icon: "a",
        },
        {
          id: "b",
          icon: "b",
        },
      ],
    });
    const cmp = cmpRoot.childAt(0);
    const labelContainer = cmp.childAt(0);
    const divider = labelContainer.childAt(1);
    const btn0 = labelContainer.childAt(2);
    const btn1 = labelContainer.childAt(3);

    expect(divider.name()).toEqual("div");
    expect(divider.prop("style")).toMatchObject({ flex: 1, minWidth: 20 });

    expect(btn0.name()).toEqual("ListItemButton");
    expect(btn0.prop("icon")).toContain(props.buttons[0].icon);
    expect(btn1.name()).toEqual("ListItemButton");
    expect(btn1.prop("icon")).toContain(props.buttons[1].icon);
  });
});
