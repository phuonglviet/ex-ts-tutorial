const baseConfig = require("./webpack.config.base.js");
const merge = require("webpack-merge");

const config = merge(baseConfig, {
    mode: "production"
});

module.exports = config;
