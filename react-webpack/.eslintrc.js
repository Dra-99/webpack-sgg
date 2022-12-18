module.exports = {
    // 继承 Eslint 规则
    extends: ["react-app"],
    // env: {
    //     node: true, // 启用node中全局变量
    //     browser: true, // 启用浏览器中全局变量
    // },
    parserOptions: {
        // ecmaVersion: 6,
        // sourceType: "module",
        babelOptions: {
            presets: [
                ["babel-preset-react-app", false],
                "babel-preset-react-app/prod"
            ]
        }
    },
    // rules: {
    //     "no-var": 2, // 不能使用 var 定义变量
    // },
};