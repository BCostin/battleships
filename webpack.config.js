const path = require('path');
const Webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development' ? true : false;

let appConfig = require('dotenv').config();

appConfig = appConfig.parsed;
appConfig = Object.keys(appConfig).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(appConfig[next]);
    return prev;
}, {});

module.exports = {
    entry: {
        client: path.resolve(__dirname, './src/index.tsx'),
        vendor: ['react', 'react-dom'],
    },
    mode: isDev ? "development" : "production",
    stats: {
        modules: false,
    },
    output: {
        filename: "[name].[contenthash].js",
        chunkFilename: "[name].[contenthash].js",
        path: path.resolve(__dirname, "./build"),
        publicPath: "/",
    },
    resolve: {
        extensions: [".js", ".jsx", ".json", ".ts", ".tsx"],
    },
    target: "web",
    devtool: isDev ? "inline-source-map" : false,
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                resolve: {
                    extensions: ['.ts', '.tsx', '.js', '.json'],
                },
                use: "ts-loader",
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg|eot|ttf|woff|woff2)$/,
                type: 'asset/resource'
            },
            {
                test: /\.(sass|scss|css)$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
            },
        ],
    },
    optimization: {
        minimize: true,
        minimizer: [!isDev ? () => {} : () => {}],
        splitChunks: {
            chunks: 'all',
        },
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css',
            chunkFilename: '[id].[contenthash].css',
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "./src/template/index.html"),
            inject: "body",
        }),
        new Webpack.DefinePlugin(
            Object.assign({}, appConfig, {
                '__isBrowser__': true,
                '__REACT_DEVTOOLS_GLOBAL_HOOK__': { 
                    isDisabled: true 
                }
            })
        ),
        
        // Code minifier for non-development environments
        !isDev ? new TerserPlugin() : () => {},
    ],
    devServer: {
        port: 3000,
        historyApiFallback: {
            index: '/'
        },
        static: [
            { directory: path.join(__dirname, './build') },
            { directory: path.join(__dirname, './static'), },
        ],
    }
};
