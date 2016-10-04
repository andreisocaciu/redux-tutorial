/**
 * Created by Andrei on 9/29/2016.
 */

var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var BUILD_DIR = path.resolve(__dirname, 'public/js/app/build');
var APP_DIR = path.resolve(__dirname, 'public/js/app/src');

var plugins = [
    new ExtractTextPlugin('app.css'),
];

var config = {
    entry: APP_DIR + '/index.js',
    output: {
        path: BUILD_DIR,
        filename: 'app.js',
    },
    module: {
        loaders: [
            {
                test: /\.js?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['react', 'es2015', 'stage-0'],
                    plugins: ['react-html-attrs', 'transform-class-properties', 'transform-decorators-legacy'],
                },
            },
            {
                test: /\.scss?/,
                loader: ExtractTextPlugin.extract('css?modules&sourceMap&importLoaders=1&localIdentName=[name]__[local]!sass?outputStyle=expanded&sourceMap'),
                include: APP_DIR,
            },
        ],
    },
    plugins: plugins,
};

module.exports = config;
