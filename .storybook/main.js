// .storybook/main.js

const path = require("path");

// your app's webpack.config.js
const custom = require("./webpack.config.js");

module.exports = {
  core: { builder: "webpack5" },
  stories: [
    "../src/componentsBase/index.stories.tsx",
    "../src/componentsBase/**/*.stories.tsx",
  ],
  addons: ["@storybook/addon-essentials"],
  typescript: {
    check: true,
    configFile: "tsconfig.json",
    reactDocgen: "react-docgen-typescript",
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) =>
        prop.parent ? !/node_modules/.test(prop.parent.fileName) : true,
    },
  },
  webpackFinal: async (config) => {
    return {
      ...config,
      module: {
        ...config.module,
        rules: [].concat(config.module.rules).concat(custom.module.rules),
      },
    };
  },
};
