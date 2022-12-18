const ESLintPlugin = require("eslint-webpack-plugin");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin")
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin")

const handleCssLoader = (...args) => {
    return [
        "style-loader",
        "css-loader",
        {
            loader: 'postcss-loader',
            options: {
                postcssOptions: {
                    plugins: ['postcss-preset-env'],
                },
            },
        }
    ].concat(args)
}

module.exports = {
    entry: "./src/main.js",
    output: {
        path: undefined,
        filename: "static/js/[name].js", // 打包后的入口文件名
        chunkFilename: "static/js/[name].chunk.js", // 打包时的额外导入的文件名，eg: 通过import动态导入的将使用此文件名
        assetModuleFilename: "static/media/[hash:10][ext][query]" // 图片资源文件
    },
    module: {
        rules: [{
            oneOf: [
                // 处理css
                {
                    test: /\.css$/,
                    // style-loader是将css插入到dom中
                    // css-loader用来解析css文件
                    // postcss-loader使用postcss-preset-env预设处理兼容性问题
                    use: handleCssLoader()
                },
                {
                    test: /\.less$/,
                    use: handleCssLoader("less-loader")
                },
                {
                    test: /\.s[ac]ss$/,
                    use: handleCssLoader("sass-loader")
                },
                {
                    test: /\.styl$/,
                    use: handleCssLoader("stylus-loader")
                },
                // 处理图片
                {
                    test: /\.(jpe?g|png|jpg|gif|svg|webp)$/,
                    type: 'asset', //这里指的是使用base64编码进行转化
                    parser: {
                        dataUrlCondition: {
                            maxSize: 50 * 1024
                        }
                    }
                },
                // 处理其他资源
                {
                    test: /\.(woff2?|ttf)/,
                    type: "asset/resource" //不进行base64转换，原样输出
                },
                // 处理js
                {
                    test: /\.(js|jsx)$/,
                    include: path.resolve(__dirname, "src"),
                    loader: "babel-loader",
                    options: {
                        cacheDirectory: true,
                        cacheCompression: false,
                        plugins: [
                            // "@babel/plugin-transform-runtime", // presets中包含了
                            "react-refresh/babel", // 开启js的HMR功能
                        ],
                    }
                }
            ]
        }]
    },
    plugins: [
        new ESLintPlugin({
            context: path.resolve(__dirname, "src"),
            exclude: "node_modules",
            cache: true,
            cacheLocation: path.resolve(__dirname, "node_modules/.cache/.eslintcache")
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "public/index.html")
        }),
        new ReactRefreshWebpackPlugin(), // 解决js的HMR功能运行时全局变量的问题
    ],
    mode: "development",
    devtool: "cheap-module-source-map",
    // 分包
    optimization: {
        splitChunks: {
            chunks: "all"
        },
        runtimeChunk: {
            name: (entrypoint) => `runtime~${entrypoint.name}`
        }
    },
    resolve: {
        extensions: [".jsx", ".js", ".json"], // 自动补全文件扩展名，让jsx可以使用
    },
    devServer: {
        open: true,
        host: "localhost",
        port: 3000,
        hot: true,
        compress: true,
        historyApiFallback: true, // 解决react-router刷新404问题
    },
}