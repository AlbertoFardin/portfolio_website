/* eslint-disable @typescript-eslint/no-var-requires */
const { merge } = require("webpack-merge");
const common = require("./webpack.config.common.js");
const path = require("path");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;

module.exports = merge(common, {
  devtool: "eval-source-map",
  mode: "production",
  plugins: [new BundleAnalyzerPlugin()],
  devServer: {
    https: true,
    hot: true,
    static: {
      directory: path.join(__dirname, "./"),
    },
    historyApiFallback: true,
    allowedHosts: ["local.wardacloud.com"],
    host: "0.0.0.0",
    port: 443,
  },
});
