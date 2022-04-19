/* eslint-disable */
export const getDistanceBetweenPoints = (pointA, pointB) =>
  Math.sqrt(
    Math.pow(pointA.y - pointB.y, 2) + Math.pow(pointA.x - pointB.x, 2)
  );

export const between = ({ min, max, value }) =>
  Math.min(max, Math.max(min, value));

export const getTouchMidpoint = (pointA, pointB) => ({
  x: (pointA.x + pointB.x) / 2,
  y: (pointA.y + pointB.y) / 2,
});

export const getPointFromTouch = (point, element) => {
  const rect = element.getBoundingClientRect();
  return {
    x: point.clientX - rect.left,
    y: point.clientY - rect.top,
  };
};

export const isSwiping = (self) => {
  const s = self.state;
  return s.imageScale === s.imageScaleMin;
};

export const constrainImageXY = ({
  point,
  containerSize,
  imageSize,
  imageScale,
}) => {
  const imageWidth = imageSize.width;
  const imageHeight = imageSize.height;
  const containerWidth = containerSize.width;
  const containerHeight = containerSize.height;

  const dW = containerWidth - imageWidth * imageScale;
  const fixX =
    dW >= 0 ? 0.5 * dW : between({ min: dW, max: 0, value: point.x });

  const dH = containerHeight - imageHeight * imageScale;
  const fixY =
    dH >= 0 ? 0.5 * dH : between({ min: dH, max: 0, value: point.y });

  return { x: fixX, y: fixY };
};

export const equalArrays = (A, B) => {
  let equal = true;
  const fistIsLong = A.length > B.length;
  const arr1 = fistIsLong ? A : B;
  const arr2 = fistIsLong ? B : A;

  for (const value1 of arr1) {
    const found = arr2.find((item) => item === value1);

    if (!found) {
      equal = false;
    }
  }
  return equal;
};
