const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')

const resolve = (...paths) => path.join(__dirname, ...paths)

const mode = process.env.NODE_ENV || 'development'

module.exports = {
  devServer: {
    contentBase: resolve('dist'),
    port: 9000,
  },
  mode,
  entry: {
    index: './src/index.js',
  },
  output: {
    path: resolve('dist'),
    filename : '[name].js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src')],
      },
    ]
  }
}
