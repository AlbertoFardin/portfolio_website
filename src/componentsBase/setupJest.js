/* istanbul ignore file */
import { configure } from "enzyme";
import * as Adapter from "@wojtekmaj/enzyme-adapter-react-17";

const mediaDevices = {
  matches: false,
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
  getSupportedConstraints: () => ({
    width: true,
    height: true,
    aspectRatio: true,
    frameRate: true,
    facingMode: true,
    resizeMode: true,
    sampleRate: true,
    sampleSize: true,
    echoCancellation: true,
    autoGainControl: true,
    noiseSuppression: true,
    latency: true,
    channelCount: true,
    deviceId: true,
    groupId: true,
  }),
};

global.navigator.mediaDevices = mediaDevices;

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// eslint-disable-next-line no-underscore-dangle
navigator.__defineGetter__("userAgent", () => {
  // eslint-disable-next-line max-len
  return "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36"; // customized user agent
});

navigator.userAgent; // 'foo'

configure({ adapter: new Adapter() });
