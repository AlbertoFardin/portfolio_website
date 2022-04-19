import { shallow } from "enzyme";
import * as React from "react";
import Component from "../ActionsMenu";
import createTheme from "../../theme/getMuiTheme";
import IAction from "../IAction";

function setup(config) {
  const props = {
    anchorEl: null,
    onClose: () => console.log("onClose"),
    open: false,
    classes: {
      paper: "paper",
    },
    actions: [
      {
        id: "copy",
        label: "Copy",
        onClick: () => console.log("Copy"),
      },
      {
        id: "send",
        label: "Send",
        onClick: () => console.log("Send"),
      },
    ] as IAction[],
    colorTheme: "#ff6600",
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

describe("ActionsMenu ActionsMenu", () => {
  test("full setup", () => {
    const { cmp, props } = setup({
      className: "test-class",
    });
    const child = cmp.childAt(0);

    expect(cmp.name()).toMatch("WithStyles(ForwardRef(Popover))");
    expect(cmp.prop("anchorReference")).toEqual("anchorPosition");
    expect(cmp.prop("className")).toMatch("test-class");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((cmp.prop("PaperProps") as any).style).toMatchObject({
      position: "absolute",
      zIndex: 1,
    });

    expect(cmp.children().length).toEqual(1);
    expect(child.name()).toEqual("WithStyles(ForwardRef(List))");
    expect(child.children().length).toEqual(props.actions.length);
  });

  test("width menu close", () => {
    const { cmp } = setup({
      open: false,
    });

    expect(cmp.name()).toEqual("WithStyles(ForwardRef(Popover))");
  });

  test("width anchorEl", () => {
    const { cmp } = setup({
      anchorEl: {},
    });

    expect(cmp.prop("anchorReference")).toEqual("anchorEl");
  });

  test("1 action disabled", () => {
    const { cmp, props } = setup({
      actions: [
        {
          id: "a",
          label: "aaa",
          disabled: false,
          onClick: () => console.log("aaa"),
        },
        {
          id: "b",
          label: "bbb",
          disabled: true,
          onClick: () => console.log("bbb"),
        },
        {
          id: "c",
          label: "ccc",
          disabled: false,
          onClick: () => console.log("ccc"),
        },
      ] as IAction[],
    });
    const list = cmp.childAt(0);
    props.actions.forEach((listItem, i) => {
      expect(list.childAt(i).props().disabled).toEqual(listItem.disabled);
    });
  });
});
