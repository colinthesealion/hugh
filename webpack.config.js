const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/js/index.ts',
  output: {
    filename: 'light-controller.js',
    path: path.resolve('./examples/lights/js'),
  },
  module: {
    rules: [
        {
            test: /\.ts$/,
            use: 'ts-loader',
            exclude: /node_modules/,
        },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  devtool: 'source-map',
};
