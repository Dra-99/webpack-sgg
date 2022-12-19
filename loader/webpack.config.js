const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = {
    entry: "./src/main.js",
    output: {
        path: path.resolve(__dirname, "dist/static"),
        filename: "js/[name].js",
        chunkFilename: "js/[name].chunk.js",
        clean: true
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "public/index.html")
        })
    ],
    mode: "development",
    module: {
        rules: [
            {
                test: /\.jsx?/,
                loader: "./loaders/clean-log"
            },
            {
                test: /\.jsx?$/,
                loader: "./loaders/banner-loader/index.js",
                options: {
                    author: "王保龙"
                }
            },
            {
                test: /\.jsx?$/,
                loader: "./loaders/babel-loader",
                options: {
                    presets: ["@babel/preset-env"]
                }
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/,
                loader: "./loaders/file-loader",
                type: "javascript/auto" // 阻止webpack默认处理图片资源
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            }
        ]
    }
}