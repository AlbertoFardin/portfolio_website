import { shallow } from "enzyme";
import * as React from "react";
import Component from "../LogoWarda";
import createTheme from "../../theme/getMuiTheme";

function setup(p = {}) {
  const props = {
    height: 100,
    width: 200,
    className: "_className",
    style: { backgroundColor: "red" },
    color: "lightblue",
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

describe("LogoWarda - standard props", () => {
  const { cmp, props } = setup();
  const svg = cmp.childAt(0);

  test("check props", () => {
    expect(cmp.name()).toEqual("WithStyles(ForwardRef(ButtonBase))");
    expect(cmp.hasClass(props.className)).toEqual(true);
    expect(cmp.prop("style")).toEqual({
      boxSizing: "content-box",
      height: props.height,
      margin: 0,
      padding: 0,
      width: props.width,
      cursor: "default",
      ...props.style,
    });
    expect(cmp.prop("disableRipple")).toEqual(true);
  });

  test("check svg", () => {
    expect(svg.name()).toEqual("svgLogo");
    expect(svg.prop("width")).toEqual(props.width);
    expect(svg.prop("height")).toEqual(props.height);
  });
});

describe("LogoWarda - onclick", () => {
  test("check props onClick", () => {
    const { cmp, props } = setup({
      onClick: () => console.log("onClick"),
    });

    expect(cmp.name()).toEqual("WithStyles(ForwardRef(ButtonBase))");
    expect(cmp.hasClass(props.className)).toEqual(true);
    expect(cmp.prop("style")).toEqual({
      boxSizing: "content-box",
      height: props.height,
      margin: 0,
      padding: 0,
      width: props.width,
      cursor: "pointer",
      ...props.style,
    });
    expect(cmp.prop("disableRipple")).toEqual(false);
  });
});
