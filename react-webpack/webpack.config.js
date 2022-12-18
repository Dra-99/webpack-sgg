const baseConfig = require("./webpack.base");

module.exports = () => {
    const env = process.env.NODE_ENV;
    return baseConfig(env === "development" ? "dev" : "prod")
}