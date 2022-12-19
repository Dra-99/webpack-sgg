const babel = require("@babel/core")
const schema = require("./schema.json")

module.exports = function (content) {
    // 这里的处理是异步的
    const options = this.getOptions(schema)
    const callback = this.async()
    babel.transform(content, options, (err, result) => {
        if (err) callback(err, null);
        callback(null, result.code)
    });
}