/* eslint-disable @typescript-eslint/no-var-requires */
const { merge } = require('webpack-merge');
const common = require('./webpack.config.common.js');
const path = require('path');

module.exports = merge(common, {
  devtool: 'eval-source-map',
  mode: 'development',
  devServer: {
    https: true,
    hot: true,
    // disabilito il ricaricamento automatico della pagina
    // per evitare ricaricamenti non voluti
    liveReload: false,
    static: {
      directory: path.join(__dirname, './'),
    },
    historyApiFallback: true,
    allowedHosts: ['local.portfolio.com'],
    host: '0.0.0.0',
    port: 443,
  },
});
