'use strict';

const NODE_ENV = process.env.NODE_ENV || 'development';
const webpack = require('webpack');
const path = require('path');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

let webpackConfig = {
    //context: __dirname + '/app',
    context: path.resolve(__dirname, 'app'),
    entry: {
        // file entries with extensions if 'resolve' not configured
        home: './home.js',
        formController: './formController',
        styles: './styles/master.scss'
    },
    output: {
        path: __dirname + '/public/content',
        filename: '[name].js',
        library: '[name]'
    },

    watch: NODE_ENV == 'development' ? true : false, //enables watch
    watchOptions: {
        aggregateTimeout: 100
    }, // wait 100ms and then start build

    devtool: NODE_ENV == 'development' ? '#cheap-module-source-map' : null,

    plugins: [
        // Use the plugin to specify the resulting filename (and add needed behavior to the compiler)
        new ExtractTextPlugin('styles.css', {
            allChunks: true
        }),
        // ENV plugin
        new webpack.DefinePlugin({
            NODE_ENV: JSON.stringify(NODE_ENV)
        })
    ],

    resolve: {
        moduleDirectories: ['node_modules'], // Which directories will be searched if module.exports.entry - undefined
        extension: ['','.js'] // '' - entry: './app/index.js' will work | '.js' - entry: './app/index' will work
    },

    resolveLoader: {
        moduleDirectories: ['node_modules'], // Which directory will be searched
        moduleTemplates: ['*-loader','*'], // search this module, '*-loader' - loader: 'babel' not loader: 'babel-loader' | '*' - resolve full string
        extension: ['','.js']
    },

    module: {

        loaders: [
            {
                // Babel loader to convert lastest ES to old javascript
                // use npm i babel-loader
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                }
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader?sourceMap!resolve-url!sass-loader?sourceMap!postcss-loader')
                //loaders: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader')
                // loader: ExtractTextPlugin.extract('style-loader', 'css-loader', 'postcss-loader')
            },
            {
                test: /\.woff2?$|\.otf$|\.ttf$|\.eot$|\.svg$|\.png|\.jpe?g|\.gif$/,
                loader: 'file-loader'
            }
        ]
    },
    postcss: [ autoprefixer({ browsers: ['last 2 versions'] }) ]
};

let webpackConfigBase = {
    context: path.resolve(__dirname, 'app'),
    entry: {
        // file entries with extensions if 'resolve' not configured
        home: './home.js',
        formController: './formController'
    },
    output: {
        path: __dirname + '/public/content/scripts',
        filename: '[name].js',
        library: '[name]'
    },

    watch: NODE_ENV == 'development' ? true : false, //enables watch
    watchOptions: {
        aggregateTimeout: 100
    }, // wait 100ms and then start build

    devtool: NODE_ENV == 'development' ? '#cheap-module-source-map' : null,

    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        }),
        // ENV plugin
        new webpack.DefinePlugin({
            NODE_ENV: JSON.stringify(NODE_ENV)
        })
    ],

    resolve: {
        moduleDirectories: ['node_modules'], // Which directories will be searched if module.exports.entry - undefined
        extension: ['','.js'], // '' - entry: './app/index.js' will work | '.js' - entry: './app/index' will work
        alias: {
            jquery: "jquery/src/jquery"
        }
    },

    resolveLoader: {
        moduleDirectories: ['node_modules'], // Which directory will be searched
        moduleTemplates: ['*-loader','*'], // search this module, '*-loader' - loader: 'babel' not loader: 'babel-loader' | '*' - resolve full string
        extension: ['','.js']
    },

    module: {

        loaders: [
            {
                // Babel loader to convert lastest ES to old javascript
                // use npm i babel-loader
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                }
            }
        ]
    }
};

let webpackConfigCSS = {
    context: path.resolve(__dirname, 'app'),
    entry: {
        // file entries with extensions if 'resolve' not configured
        styles: './styles/master.scss'
    },
    output: {
        path: __dirname + '/public/content/styles',
        filename: '[name].js'
    },

    watch: NODE_ENV == 'development' ? true : false, //enables watch
    watchOptions: {
        aggregateTimeout: 100
    }, // wait 100ms and then start build

    devtool: NODE_ENV == 'development' ? '#cheap-module-source-map' : null,

    plugins: [
        // Use the plugin to specify the resulting filename (and add needed behavior to the compiler)
        new ExtractTextPlugin('styles.css', {
            allChunks: true
        }),
        // ENV plugin
        new webpack.DefinePlugin({
            NODE_ENV: JSON.stringify(NODE_ENV)
        })
    ],

    resolve: {
        moduleDirectories: ['node_modules'], // Which directories will be searched if module.exports.entry - undefined
        extension: ['','.scss'] // '' - entry: './app/index.js' will work | '.js' - entry: './app/index' will work
    },

    resolveLoader: {
        moduleDirectories: ['node_modules'], // Which directory will be searched
        moduleTemplates: ['*-loader','*'], // search this module, '*-loader' - loader: 'babel' not loader: 'babel-loader' | '*' - resolve full string
        extension: ['','.scss']
    },

    module: {

        loaders: [
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader?sourceMap!resolve-url!sass-loader?sourceMap!postcss-loader')
                //loaders: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader')
                // loader: ExtractTextPlugin.extract('style-loader', 'css-loader', 'postcss-loader')
            },
            {
                test: /\.woff2?$|\.otf$|\.ttf$|\.eot$|\.svg$|\.png|\.jpe?g|\.gif$/,
                loader: 'file-loader'
            }
        ]
    },
    postcss: [ autoprefixer({ browsers: ['last 2 versions'] }) ]
}


//module.exports = webpackConfig; // watch: true works here
module.exports = [webpackConfigBase, webpackConfigCSS]; // watch: true not working need to write webpack --watch in commandline or webpack -W
// Something wrong with watching ConfigBase - need to use path.resolve(__dirname, 'app') coz __dirname + '/public/content/styles' not want to watch

// Minification plugin for production
if(NODE_ENV == 'production')
{
    // module.exports.output = {
    //     filename: 'bundle.min.js',
    //     path: './dist'
    // };
    module.exports[0].output.filename = '[name].min.js';
    module.exports[0].plugins.push (
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                drop_console: true,
                unsafe: true
            }
        }));
}
