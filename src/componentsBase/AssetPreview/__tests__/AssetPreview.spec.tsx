import { shallow } from "enzyme";
import * as React from "react";
import Component from "../AssetPreview";
import createTheme from "../../theme/getMuiTheme";

function setup(p?) {
  const props = {
    id: "id",
    className: "_className",
    style: {
      backgroundColor: "red",
      height: 100,
      width: 200,
    },
    loading: false,
    mousehover: false,
    onClick: () => console.log("onClick"),
    onSelect: () => console.log("onSelect"),
    placeholderIcon: "_placeholderIcon",
    placeholderLabel: "_placeholderLabel",
    colorTheme: "_colorTheme",
    selectable: true,
    selected: false,
    label: "",
    srcUrl: "_srcUrl",
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

describe("AssetPreview", () => {
  test("check props", () => {
    const { cmp, props } = setup();
    const asset = cmp.childAt(0);
    expect(cmp.name()).toEqual("Fragment");
    expect(asset.name()).toEqual("ClickManager");
    expect(asset.props().className).toMatch(props.className);
    expect(asset.props().style).toMatchObject(props.style);
  });

  test("check not label", () => {
    const { cmp } = setup();
    const asset = cmp.childAt(0);
    expect(asset.find("p").length).toEqual(0);
  });

  test("check label", () => {
    const { cmp, props } = setup({
      label: "_label",
    });
    const asset = cmp.childAt(0);
    const child = asset.childAt(1);
    expect(child.name()).toEqual("TypographyEllipsis");
    expect(child.props().children).toEqual(props.label);
  });
});
