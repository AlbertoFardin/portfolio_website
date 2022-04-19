/* eslint-disable @typescript-eslint/no-var-requires */
const { merge } = require("webpack-merge");
const { ncp } = require("ncp");
const common = require("./webpack.config.common.js");

ncp.limit = 16;

module.exports = merge(common, {
  mode: "production",
  devtool: "source-map",
  devServer: {
    https: true,
    contentBase: "./",
    historyApiFallback: true,
    disableHostCheck: true,
    host: "0.0.0.0",
    port: 443,
  },
});
