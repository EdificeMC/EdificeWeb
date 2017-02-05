'use strict';

const path = require('path');
const AureliaWebpackPlugin = require('aurelia-webpack-plugin');
const ProvidePlugin = require('webpack/lib/ProvidePlugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const pkg = require('./package.json');

const outputFileTemplateSuffix = '-' + pkg.version;

module.exports = function(definitions) {
    return {
        target: 'web',
        devServer: {
            host: '0.0.0.0',
            port: 4000,
            headers: {
                'Access-Control-Allow-Origin': '*'
            }
        },
        entry: {
            main: [
                './src/main'
            ]
        },
        output: {
            path: path.join(__dirname, 'dist'),
            filename: `main${outputFileTemplateSuffix}.js`,
            chunkFilename: `[id]${outputFileTemplateSuffix}.js`
        },
        plugins: [
            new DefinePlugin(definitions),
            new AureliaWebpackPlugin({
                includeSubModules: [
                    {moduleId: 'aurelia-validation'},
                    {moduleId: 'aurelia-dialog'}
                ]
            }),
            new ProvidePlugin({
                Promise: 'bluebird/js/browser/bluebird.min.js',
                'window.Promise': 'bluebird/js/browser/bluebird.min.js',
                jQuery: 'jquery',
                $: 'jquery',
                'window.jQuery': 'jquery'
            }),
            new HtmlWebpackPlugin({
                title: 'Edifice',
                template: 'index.html',
                filename: 'index.html',
                favicon: './assets/img/favicon/favicon.ico'
            }),
            new CopyWebpackPlugin([
                { from: 'assets/img/favicon', to: 'assets/img/favicon' }
            ])
        ],
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
                loaders: ['style', 'css', 'sass']
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
        },
        node: {
            fs: "empty"
        }
    };
};
