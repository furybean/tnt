const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const cssImport = require('postcss-import');
const webpack = require('webpack');
const cssnext = require('cssnext');
const postcssNested = require('postcss-nested');
const postcssOpacity = require('postcss-opacity');
var outputFilename = '[name].js';

const rootPaths = [];

var plugins = [];

if (process.env.COMPRESS) {
  plugins.push(
    new ExtractTextPlugin('[name].[contenthash:6].css'),
    new webpack.optimize.UglifyJsPlugin({})
  );
  outputFilename = '[name].[chunkhash:6].js';
} else {
  plugins.push(
    new ExtractTextPlugin('[name].css')
  );
}

module.exports = {
  entry: {
    main: './src/index.js'
  },
  output: {
    path: './dist',
    filename: outputFilename
  },
  resolve: {
    root: rootPaths
  },
  module: {
    preLoaders: [
      { test: /\.js$/, exclude: /node_modules|bower_components/, loader: 'eslint-loader' }
    ],
    loaders: [
      { test: /\.js$/, exclude: /node_modules|bower_components/, loader: 'babel' },
      { test: /\.css$/, loader: ExtractTextPlugin.extract('style', 'css!postcss') },
      { test: /\.(gif|png|jpg)$/, loader: 'url?limit=20000&name=[path][name].[hash:6].[ext]' },
      { test: /\.(ttf|svg|woff2|woff|eot)$/, loader: 'url?limit=100&name=[path][name].[hash:6].[ext]' }
    ]
  },
  postcss: function() {
    return [
      cssImport({
        path: [path.join(__dirname, './src/css')],
        onImport: function (files) {
          files.forEach(this.addDependency);
        }.bind(this)
      }),
      postcssNested,
      postcssOpacity,
      cssnext({ browsers: ['ie >= 8', 'chrome >= 26', 'Firefox ESR'] })
    ];
  },
  plugins: plugins
};
