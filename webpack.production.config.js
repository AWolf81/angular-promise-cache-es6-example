var common = require('./webpack.config');
var path = require('path');
var webpack = require('webpack');

common.output.path = path.resolve(__dirname, 'dist');

common.plugins.concat([
    new webpack.optimize.CommonsChunkPlugin('common.js'),
    new webpack.optimize.DedupePlugin(),
    // new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.AggressiveMergingPlugin()
]);

module.exports = common;