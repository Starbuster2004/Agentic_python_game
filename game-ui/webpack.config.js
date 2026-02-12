const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: './src/main.js',
    output: { path: path.resolve(__dirname, 'dist'), filename: 'bundle.js', clean: true },
    devServer: { port: 8080, hot: true },
    module: {
        rules: [{
            test: /\.js$/, exclude: /node_modules/,
            use: { loader: 'babel-loader', options: { presets: ['@babel/preset-env'] } }
        }]
    },
    plugins: [
        new HtmlWebpackPlugin({ template: './index.html' }),
        new CopyWebpackPlugin({ patterns: [{ from: 'public/assets', to: 'assets' }] }),
    ]
};