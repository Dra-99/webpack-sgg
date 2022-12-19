module.exports = (content) => {
    return content.replace(/console\.log\(.*\);?/, '');
}