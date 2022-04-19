import { shallow } from "enzyme";
import * as React from "react";
import Component from "../ImageZoom";
import createTheme from "../../theme/getMuiTheme";

function setup() {
  const props = {
    className: "test-classname",
    imageIndex: 2,
    images: ["./a/b/c/test_1.jpg", "./a/b/c/test_2.jpg", "./a/b/c/test_3.jpg"],
    style: { background: "red" },
    zoomIdContainer: "id_container",
    zoomIdImage: "id_image",
    zoomMaxScale: 20,
    onChangeImage: () => null,
  };
  const muiTheme = createTheme({});
  const shallowWithContext = (node) => shallow(node, { context: { muiTheme } });
  const cmp = shallowWithContext(<Component {...props} />);

  return {
    props,
    cmp,
  };
}

describe("ImageZoom", () => {
  const { cmp, props } = setup();
  const image = cmp.childAt(0);
  const switchbox = cmp.childAt(1);

  test("check property className", () => {
    expect(cmp.hasClass(props.className)).toEqual(true);
  });

  test("check property style", () => {
    expect(cmp.prop("style")).toEqual(props.style);
  });

  test("check image", () => {
    expect(image.prop("style")).toEqual({
      display: "none",
      top: 0,
      left: 0,
      transition: false,
      transform: "scale(1)",
    });
    expect(cmp.name()).toEqual("div");
    expect(image.name()).toEqual("img");
    expect(cmp.find("img").exists()).toEqual(true);
  });

  test("check switches", () => {
    expect(switchbox.name()).toEqual("ImageZoomSwitches");
  });
});
