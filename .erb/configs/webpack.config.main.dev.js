/**
 * Webpack config for development electron main process
 */

const path = require('path');
const webpack = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { merge } = require('webpack-merge');
const checkNodeEnv = require('../scripts/check-node-env');
const baseConfig = require('./webpack.config.base');
const webpackPaths = require('./webpack.paths');

// When an ESLint server is running, we can't set the NODE_ENV so we'll check if it's
// at the dev webpack config is not accidentally run in a production environment
if (process.env.NODE_ENV === 'production') {
  checkNodeEnv('development');
}

const configuration = {
  devtool: 'inline-source-map',

  mode: 'development',

  target: 'electron-main',
// trailingComma
  entry: {
    main: path.join(webpackPaths.srcMainPath, 'main.js'),
    preload: path.join(webpackPaths.srcMainPath, 'preload.js')
  },

  output: {
    path: webpackPaths.dllPath,
    filename: '[name].bundle.dev.js',
    library: {
      type: 'umd',
    },
  },

  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: process.env.ANALYZE === 'true' ? 'server' : 'disabled',
      analyzerPort: 8888,
    }),

    new webpack.DefinePlugin({
      'process.type': '"browser"',
    }),
  ],

  /**
   * Disables webpack processing of __dirname and __filename.
   * If you run the bundle in node.js it falls back to these values of node.js.
   * https://github.com/webpack/webpack/issues/2010
   */
  node: {
    __dirname: false,
    __filename: false,
  },
};

module.exports = merge(baseConfig, configuration);
