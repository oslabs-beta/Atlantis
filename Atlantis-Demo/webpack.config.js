const webpack = require('webpack');
const path = require('path');
const entry = path.resolve(__dirname, './client/index.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  module: {
    rules: [
      {
        test: /\.jsx?/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.s[ac]ss$/i,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
            },
          },
        ],
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'svg-url-loader',
            options: {
              limit: 10000,
            },
          },
        ],
      },
    ],
  },
  entry: entry,
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  devServer: {
    // host: '0.0.0.0',
    contentBase: [
      path.resolve(__dirname, '/build'),
      path.resolve(__dirname + '/client/public'),
    ],
    historyApiFallback: true,
    proxy: {
      '/cachetest': { target: 'http://localhost:3000', changeOrigin: true },
      '/clearcache/': { target: 'http://localhost:3000', changeOrigin: true },
      '/eriktest/': 'http://localhost:3000',
      '/graphql/': 'http://localhost:3000',
    },
    hot: true,
  },
  mode: 'development',
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'client', 'public', 'index.html'),
    }),
  ],
};
