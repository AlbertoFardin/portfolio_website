module.exports = {
  bail: true,
  preset: "ts-jest/presets/js-with-ts",
  testEnvironment: "jsdom",
  reporters: ["default", "jest-junit"],
  roots: ["<rootDir>/src/"],
  setupFiles: ["./jest.setupFiles.js"],
  testEnvironmentOptions: {
    userAgent: "Agent/00",
  },
  testMatch: ["**/?(*.)+(spec|test).[jt]s?(x)"],
  transformIgnorePatterns: [
    "<rootDir>/node_modules/(?!(lodash-es.*?\\.js$|@warda\\/library-ui))",
  ],
  globalSetup: "./jest.globalSetup.js",
};
