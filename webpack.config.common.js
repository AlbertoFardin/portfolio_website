/* eslint-disable @typescript-eslint/no-var-requires */
// const ExtractTextPlugin = require('extract-text-webpack-plugin')
const path = require("path");
const Dotenv = require("dotenv-webpack");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");

module.exports = {
  module: {
    rules: [
      {
        test: /\.(t|j)sx?$/,
        loader: "ts-loader",
        exclude: [/node_modules/],
      },
      {
        enforce: "pre",
        test: /\.js$/,
        loader: "source-map-loader",
        exclude: [/node_modules/],
      },
      {
        test: /\.scss$/,
        include: [
          path.resolve(__dirname, "./src"),
          path.resolve(__dirname, "."),
          path.resolve(__dirname, "./node_modules/react-dates"),
        ],
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: "css-loader",
            options: {
              modules: true,
              sourceMap: true,
            },
          },
          {
            loader: "postcss-loader",
          },
          {
            loader: "sass-loader",
          },
        ],
      },
      {
        test: /\.(png|svg|jpg|gif|woff|woff2|eot|ttf|otf)$/,
        use: ["file-loader"],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          "css-loader",
        ],
      },
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false,
        },
      },
    ],
  },
  resolve: {
    extensions: ["*", ".js", ".ts", ".tsx"],
  },
  entry: {
    bundle: "./src/index.tsx",
  },
  plugins: [
    new CompressionPlugin({
      test: /\.js(\?.*)?$/i,
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: "static" }],
    }),
    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /it/),
    // new LodashModuleReplacementPlugin(),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptpack.output
      filename: "build.css",
      chunkFilename: "[id].[chunkhash].css",
    }),
    new CleanWebpackPlugin(),
    new Dotenv({
      path: "./.env",
      safe: false,
      systemvars: true,
    }),
  ],
  output: {
    path: path.resolve(__dirname, "bucket"),
    publicPath: "/",
    filename: "build.js",
    chunkFilename: "[id].[chunkhash].js",
  },
};
