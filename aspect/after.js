let after = {
    async afterGet(params) {
        console.log("自定义之后方法执行", params);
    }
}

module.exports = after;