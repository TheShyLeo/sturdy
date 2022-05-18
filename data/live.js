'use strict';

const base = shared.get('base').data;
class data extends base {
    constructor(ctx) {
        super(ctx);
    }

    async getRealUrl(condition) {
        let getUrl = require(`./${condition.platform}`)
        let url = await getUrl(condition.rid);
        return url;
    };
}

module.exports = data;