const webpackBase = require('../../build/webpack/webpack.config.base')

const preload = {
  ...webpackBase,

  target: 'electron-preload',
  devtool: false,

  entry: {
    preload: './preload.ts',
  },

  output: {
    path: __dirname,
  },
}

module.exports = [preload]
