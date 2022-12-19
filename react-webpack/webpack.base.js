const ESLintPlugin = require("eslint-webpack-plugin");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin")
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin")
const MinicssExtractPlugin = require("mini-css-extract-plugin")
const CopyWebpackPlugin = require("copy-webpack-plugin")
const CssMinimizerWebpackPlugin = require("css-minimizer-webpack-plugin")
const TerserWebpackPlugin = require("terser-webpack-plugin")
const ImgMinimizerWebpackPlugin = require("image-minimizer-webpack-plugin")

module.exports = (mode) => {

    const handleCssLoader = (pre) => {
        return [
            mode === "dev" ? "style-loader" : MinicssExtractPlugin.loader,
            "css-loader",
            {
                loader: 'postcss-loader',
                options: {
                    postcssOptions: {
                        plugins: ['postcss-preset-env'],
                    },
                },
            },
            pre && {
                loader: pre,
                options: preProcessor === "less-loader" ?
                    {
                        // antd的自定义主题
                        lessOptions: {
                            modifyVars: {
                                // 其他主题色：https://ant.design/docs/react/customize-theme-cn
                                "@primary-color": "#1DA57A", // 全局主色
                            },
                            javascriptEnabled: true,
                        },
                    } :
                    {},
            },
        ].filter(Boolean)
    }

    console.log(handleCssLoader("less-loader"))

    const basePlugin = [
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
    ]

    return {
        entry: "./src/main.js",
        output: {
            path: mode === "dev" ? undefined : path.resolve(__dirname, "dist"),
            filename: "static/js/[name].js", // 打包后的入口文件名
            chunkFilename: "static/js/[name].chunk.js", // 打包时的额外导入的文件名，eg: 通过import动态导入的将使用此文件名
            assetModuleFilename: "static/media/[hash:10][ext][query]", // 图片资源文件
            clean: mode === "dev" ? false : true
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
                            plugins: mode === "dev" ? [
                                // "@babel/plugin-transform-runtime", // presets中包含了
                                "react-refresh/babel", // 开启js的HMR功能
                            ] : [],
                        }
                    }
                ]
            }]
        },
        plugins: mode === "dev" ? basePlugin : basePlugin.concat([
            new MinicssExtractPlugin({
                filename: "static/css/[name].[contenthash:10].css",
                chunkFilename: "static/css/[name].[contenthash:10].chunk.css"
            }),
            new CopyWebpackPlugin({
                patterns: [{
                    from: path.resolve(__dirname, "public"),
                    to: path.resolve(__dirname, "dist"),
                    globOptions: {
                        ignore: ["**/index.html"],
                    },
                }],
            })
        ]),
        mode: mode === "dev" ? "development" : "production",
        devtool: mode === "dev" ? "cheap-module-source-map" : "source-map",
        // 分包
        optimization: {
            splitChunks: {
                chunks: "all"
            },
            runtimeChunk: {
                name: (entrypoint) => `runtime~${entrypoint.name}`
            },
            minimizer: mode === "dev" ? [] : [
                new CssMinimizerWebpackPlugin(),
                new TerserWebpackPlugin(),
                new ImgMinimizerWebpackPlugin({
                    minimizer: {
                        implementation: ImgMinimizerWebpackPlugin.imageminGenerate,
                        options: {
                            plugins: [
                                ["gifsicle", {
                                    interlaced: true
                                }],
                                ["jpegtran", {
                                    progressive: true
                                }],
                                ["optipng", {
                                    optimizationLevel: 5
                                }],
                                [
                                    "svgo",
                                    {
                                        plugins: [
                                            "preset-default",
                                            "prefixIds",
                                            {
                                                name: "sortAttrs",
                                                params: {
                                                    xmlnsOrder: "alphabetical",
                                                },
                                            },
                                        ],
                                    },
                                ],
                            ],
                        },
                    }
                })
            ]
        },
        resolve: {
            extensions: [".jsx", ".js", ".json"], // 自动补全文件扩展名，让jsx可以使用
        },
        devServer: mode === "dev" ? {
            open: true,
            host: "localhost",
            port: 3000,
            hot: true,
            compress: true,
            historyApiFallback: true, // 解决react-router刷新404问题
        } : undefined,
    }
}