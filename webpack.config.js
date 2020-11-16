const webpack = require('webpack');
const path = require('path');

const entry = [
  './src/client/index.js'
];

const output = {
  path: path.resolve(__dirname, 'build'),
  publicPath: '/build/',
  filename: 'bundle.js',
};

module.exports = {
  entry, output,
  // devtool: "eval-source-map",
  module: {
    rules: [
      {
        test: /\.jsx?/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [ '@babel/preset-env', '@babel/preset-react' ]
          }
        }
      },
      // {
      //   test: /\.s[ac]ss$/i,
      //   use: [ 'style-loader', 'css-loader', 'sass-loader' ]
      // }
    ]
  },
};    
          