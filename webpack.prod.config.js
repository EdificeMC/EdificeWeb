/*eslint-disable no-var*/

var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var AureliaWebpackPlugin = require('aurelia-webpack-plugin');
var ProvidePlugin = require('webpack/lib/ProvidePlugin');
var DefinePlugin = require('webpack/lib/DefinePlugin');
var pkg = require('./package.json');

var outputFileTemplateSuffix = '-' + pkg.version;

module.exports = {
    entry: {
        main: [
            './src/main'
        ]
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name]' + outputFileTemplateSuffix + '.js',
        chunkFilename: '[id]' + outputFileTemplateSuffix + '.js'
    },
    plugins: [
        new DefinePlugin({
            'ENV': "'production'";
            'API_URL': "'https://api.edificemc.com/'",
        }),
        new AureliaWebpackPlugin({
            includeSubModules: [
                {moduleId: 'aurelia-validatejs'},
                {moduleId: 'aurelia-validation'}
            ]
        }),
        new HtmlWebpackPlugin({
            title: 'Edifice - ' + pkg.version,
            template: 'index.prod.html',
            filename: 'index.html'
        }),
        new ProvidePlugin({
            Promise: 'bluebird',
            jQuery: 'jquery',
            $: 'jquery',
            'window.jquery': 'jquery'
        })
    ],
    resolve: {
        root: [
            path.resolve('./')
        ]
    },
    module: {
        loaders: [{
            test: /\.js$/,
            loader: 'babel',
            exclude: /node_modules\/(?!edifice-structure-viewer)/,
            query: {
                presets: ['es2015-loose', 'stage-1'],
                plugins: ['transform-decorators-legacy']
            }
        }, {
            test: /\.css?$/,
            loader: 'style!css'
        }, {
            test: /\.scss$/,
            loaders: ["style", "css", "sass"]
        }, {
            test: /\.html$/,
            loader: 'html'
        }, {
            test: /\.(png|gif|jpg)$/,
            loader: 'url?limit=8192'
        }, {
            test: /\.woff2(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            loader: 'url?limit=10000&mimetype=application/font-woff2'
        }, {
            test: /\.woff(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            loader: 'url?limit=10000&mimetype=application/font-woff'
        }, {
            test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            loader: 'file'
        }, {
          test: /node_modules[\\\/]auth0-lock[\\\/].*\.js$/,
          loaders: [
            'transform-loader/cacheable?brfs',
            'transform-loader/cacheable?packageify'
          ]
        }, {
          test: /node_modules[\\\/]auth0-lock[\\\/].*\.ejs$/,
          loader: 'transform-loader/cacheable?ejsify'
        }, {
          test: /\.json$/,
          loader: 'json-loader'
        }]
    }
};
