import { shallow } from "enzyme";
import * as React from "react";
import Component from "../AssetFolder";
import createTheme from "../../theme/getMuiTheme";

function setup(p?) {
  const props = {
    className: "_className",
    style: { backgroundColor: "red" },
    onClick: () => console.log("onClick"),
    onDoubleClick: () => console.log("onSelect"),
    onContextMenu: () => console.log("onContextMenu"),
    colorTheme: "_colorTheme",
    selected: false,
    label: "label",
    ...p,
  };
  const muiTheme = createTheme({});
  const shallowWithContext = (node) => shallow(node, { context: { muiTheme } });
  const cmp = shallowWithContext(<Component {...props} />);
  return {
    props,
    cmp,
  };
}

describe("AssetFolder", () => {
  test("check props", () => {
    const { cmp, props } = setup();
    const asset = cmp.childAt(0);
    expect(cmp.name()).toEqual("Fragment");
    expect(asset.name()).toEqual("ClickManager");
    expect(asset.props().className).toMatch(props.className);
    expect(asset.props().style).toMatchObject(props.style);
    expect(asset.childAt(0).name()).toEqual("WithStyles(ForwardRef(Icon))");
  });

  test("check label", () => {
    const { cmp, props } = setup();
    const asset = cmp.childAt(0);
    const label = asset.childAt(1);
    expect(label.name()).toEqual("TypographyEllipsis");
    expect(label.props().children).toEqual(props.label);
  });

  test("check icon", () => {
    const { cmp } = setup();
    const asset = cmp.childAt(0);
    const icon = asset.childAt(0);
    expect(icon.name()).toEqual("WithStyles(ForwardRef(Icon))");
    expect(icon.props().children).toEqual("folder_open");
  });

  test("check selected", () => {
    const { cmp, props } = setup({
      selected: true,
    });
    const asset = cmp.childAt(0);
    const icon = asset.childAt(0);
    expect(icon.props().style).toMatchObject({ color: props.colorTheme });
  });
});
