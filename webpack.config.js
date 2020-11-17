const webpack = require('webpack');
const path = require('path');

const entry = ['./src/client/index.js'];

const output = {
  path: path.resolve(__dirname, 'build'),
  publicPath: '/build/',
  filename: 'bundle.js',
};

module.exports = {
  entry,
  output,
  devtool: 'eval-source-map',
  devServer: {
    host: 'localhost',
    port: 8080,
    publicPath: '/build/',
    proxy: {
      '/api/': 'http://localhost:3000',
    },
  },
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
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  performance: { hints: false },
};
