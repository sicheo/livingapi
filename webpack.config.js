const path = require('path');
// see: https://survivejs.com/webpack/foreword/
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
    mode: 'development',
    entry: './lib/src/public/script/index.js',
    output: {
        path: path.resolve(__dirname, 'lib/src/public/script/dist'),
        filename: 'brouser.bundle.js'
    },
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()],
    },
};