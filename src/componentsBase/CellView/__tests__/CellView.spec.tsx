import { shallow } from "enzyme";
import * as React from "react";
import Component from "../CellView";
import createTheme from "../../theme/getMuiTheme";

function setup(config?) {
  const props = {
    className: "_className",
    classes: {
      root: "root",
    },
    style: { backgroundColor: "red" },
    items: [{ id: "1" }],
    itemsCount: 1,
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

describe("CellView", () => {
  test("check layout", () => {
    const { cmp, props } = setup();
    expect(cmp.hasClass(props.className)).toEqual(true);
    expect(cmp.prop("style")).toEqual(props.style);
    expect(cmp.name()).toEqual("div");
    expect(cmp.childAt(0).name()).toEqual("AutoSizer");
  });
});
