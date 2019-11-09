const path = require('path');

const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
   entry: [
       'babel-polyfill',
       './src/js/index.js',
       './src/css/style.css'
    ],
    output: {
        filename: './src/js/index.js'
    },

    devtool: "source-map",

    module: {
        rules: [{
            test: /\.js$/,
            include: path.resolve(__dirname, 'src/js'),
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['env']
                }
            }
        },
            {
                test: /\.css$/,
                include: path.resolve(__dirname, 'src/css'),
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
            },
        ]
    },

    plugins:[
        new CleanWebpackPlugin(),
        new CopyPlugin([
            { from: 'src/assets', to: 'assets' },
            { from: 'src/json', to: 'src/json' },
            { from: './index.html', to: './index.html' }
        ]),
        new ExtractTextPlugin({
            filename: './src/css/style.css',
            allChunks: true,
        })
    ]
};
