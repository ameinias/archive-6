/**
 * Base webpack config used across other specific configs
 */

const path = require('path');
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
        include: [
          path.resolve(webpackPaths.rootPath, 'packages/app-electron/src'),
          path.resolve(webpackPaths.rootPath, 'packages/shared')
      ],
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          configFile: path.resolve(webpackPaths.rootPath, 'babel.config.js'),
          presets: [
            ['@babel/preset-env', { targets: { electron: '35' } }],
            ['@babel/preset-react', { runtime: 'automatic' }]
          ]
        }
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
  alias: {
    '@shared': path.resolve(webpackPaths.rootPath, 'packages/shared'),
    '@electron': path.resolve(webpackPaths.rootPath, 'packages/app-electron/src'), // ✅ Fixed path
    '@components': path.resolve(webpackPaths.rootPath, 'packages/shared/components'),
    '@utils': path.resolve(webpackPaths.rootPath, 'packages/shared/utils'),
    '@hooks': path.resolve(webpackPaths.rootPath, 'packages/shared/hooks'),
  },
  },

  plugins: [new webpack.EnvironmentPlugin({ NODE_ENV: 'production' })],


};

module.exports = configuration;
