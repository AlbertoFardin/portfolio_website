import { configure } from "enzyme";
import * as Adapter from "@wojtekmaj/enzyme-adapter-react-17";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const customGlobal = global;
// tslint:disable-next-line:no-var-requires
customGlobal.fetch = require("jest-fetch-mock");

customGlobal.fetchMock = customGlobal.fetch;

// faccio durare il test 120 sec
jest.setTimeout(120000);

configure({ adapter: new Adapter() });
