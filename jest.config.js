module.exports = {
  bail: true,
  preset: "ts-jest/presets/js-with-ts",
  testEnvironment: "jsdom",
  reporters: ["default", "jest-junit"],
  roots: ["<rootDir>/src/"],
  setupFiles: ["./src/setupJest.js"],
  moduleNameMapper: {
    "\\.(css|less|scss)$": "identity-obj-proxy",
  },
  testEnvironmentOptions: {
    userAgent: "Agent/00",
  },
  testMatch: ["**/?(*.)+(spec|test).[jt]s?(x)", "**/?(*.)+(docker).[jt]s?(x)"],
  transformIgnorePatterns: [
    "<rootDir>/node_modules/(?!(lodash-es.*?\\.js$|@warda\\/library-ui))",
  ],
  globalSetup: "./src/jest.globalSetup.ts",
};
