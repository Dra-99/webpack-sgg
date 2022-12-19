const loadUtils = require("loader-utils")

module.exports = function(content) {
    // 得到文件名
    let filename = loadUtils.interpolateName(this, "[name].[ext][query]", {
        content
    })
    filename = `media/${filename}`;
    // 将文件输出
    this.emitFile(filename, content);
    return `module.exports = "${filename}"`
}

// 二进制文件
module.exports.raw = true;