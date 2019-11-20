const root = require('app-root-path').path;
const Dotenv = require('dotenv-webpack');
const nodeExternals = require("webpack-node-externals");
const path = require("path");

// const BUILD_ROOT = path.join(__dirname, "../dist/server");
const BUILD_ROOT = path.join(__dirname, "../dist");
const SRC_ROOT = path.join(__dirname, "../src");

module.exports = {
    context: SRC_ROOT,
    // entry: '../bin/www.js',
    // entry: `${root}/bin/www.ts`,
    entry: `${root}/bin/www.ts`,
    // externals: [nodeExternals()],
    externals: [
        /^[a-z\-0-9]+$/ // Ignore node_modules folder
    ],
    target: 'node',
    // target: 'web',
    output: {
        filename: "server.js",
        // filename: '[name].js',
        path: BUILD_ROOT,
        libraryTarget: "commonjs"
    },
    // optimization: {
    //     splitChunks: {
    //         chunks: 'all',
    //     },
    // },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                loader: "ts-loader",
                options: {
                    configFile: "tsconfig.json"
                }
            },
            {
                test: /\.pug$/, 
                use: [
                  'html-loader', 
                  'pug-html-loader'
                ]
              },
        ]
    },
    resolve: {
        extensions: [".ts", '.tsx', ".js", ".json", '.webpack.js', '.web.js'],
        alias: {
            "@": path.join(__dirname, "/src/")
        }
        // ,
        // modules: [
        //     `${root}/node_modules`,
        //     'node_modules'
        // ]
    },
    plugins: [
        new Dotenv({
            path: './.env', // Path to .env file (this is the default)
            safe: false // load .env.example (defaults to "false" which does not use dotenv-safe)
        })
    ],
    node: {
        __dirname: false,
        __filename: true,
    }
};