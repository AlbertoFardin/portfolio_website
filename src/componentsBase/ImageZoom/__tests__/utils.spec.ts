import {
  between,
  constrainImageXY,
  equalArrays,
  getDistanceBetweenPoints,
  getTouchMidpoint,
} from "../utils";

describe("ImageZoom Utils", () => {
  test("getDistanceBetweenPoints", () => {
    const point1 = { x: 100, y: 100 };
    const point2 = { x: 100, y: 450 };
    const point3 = { x: 100, y: 100 };
    expect(getDistanceBetweenPoints(point1, point2)).toEqual(350);
    expect(getDistanceBetweenPoints(point1, point3)).toEqual(0);
  });

  test("between", () => {
    expect(between({ min: 0, max: 100, value: 50 })).toEqual(50);
    expect(between({ min: 0, max: 100, value: -50 })).toEqual(0);
    expect(between({ min: 0, max: 100, value: 150 })).toEqual(100);
  });

  test("getTouchMidpoint", () => {
    const point1 = { x: 100, y: 100 };
    const point2 = { x: 100, y: 450 };
    const point3 = { x: 100, y: 100 };

    expect(getTouchMidpoint(point1, point2)).toEqual({ x: 100, y: 275 });
    expect(getTouchMidpoint(point1, point3)).toEqual({ x: 100, y: 100 });
  });

  test("constrainImageXY", () => {
    const point = { x: 100, y: 100 };
    const containerSize = { width: 200, height: 300 };
    const imageSize = { width: 450, height: 600 };

    expect(
      constrainImageXY({
        point,
        containerSize,
        imageSize,
        imageScale: 1,
      })
    ).toEqual({ x: 0, y: 0 });

    expect(
      constrainImageXY({
        point,
        containerSize,
        imageSize,
        imageScale: 0.02,
      })
    ).toEqual({ x: 95.5, y: 144 });

    expect(
      constrainImageXY({
        point,
        containerSize,
        imageSize,
        imageScale: 20,
      })
    ).toEqual({ x: 0, y: 0 });
  });

  test("arrayIsEqual", () => {
    const arr = ["a", "b", "c", "d"];
    const arr1 = ["a", "b", "c", "d"];
    const arr2 = ["a", "b", "s", "d"];
    const arr3 = ["a"];
    expect(equalArrays(arr, arr1)).toEqual(true);
    expect(equalArrays(arr, arr2)).toEqual(false);
    expect(equalArrays(arr3, arr)).toEqual(false);
    expect(equalArrays(arr, arr3)).toEqual(false);
  });
});
