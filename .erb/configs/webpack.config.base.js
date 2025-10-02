/**
 * Base webpack config used across other specific configs
 */

const webpack = require('webpack');
const webpackPaths = require('./webpack.paths');
const { dependencies: externals } = require('../../release/app/package.json');

const configuration = {
  externals: [...Object.keys(externals || {})],

  stats: 'errors-only',

  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },

  output: {
    path: webpackPaths.srcPath,
    // https://github.com/webpack/webpack/issues/1114
    library: { type: 'commonjs2' },
  },

  /**
   * Determine the array of extensions that should be used to resolve modules.
   */
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    modules: [webpackPaths.srcPath, 'node_modules'],
  },

  plugins: [new webpack.EnvironmentPlugin({ NODE_ENV: 'production' })],
};

module.exports = configuration;
