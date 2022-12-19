const schema = require("./schema.json")

module.exports = function (content) {
    // schema 是对options的验证规则
    // schema 符合JSON Schema的规则
    const options = this.getOptions(schema)
    const prefix = `
        /* 
         *   author: ${options.author} 
        */
    `
    return prefix + content;
}