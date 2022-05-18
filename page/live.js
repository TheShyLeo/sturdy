'use strict';

const base = shared.get('base').page;
const Joi = require('joi');

class page extends base {
    constructor(ctx) {
        super(ctx);
    }
    data = this.new_data('live');
    static map = {
        "/realUrl": {
            "get": "getRealUrl",
        }
    }

    async getRealUrl(params) {
        const schema = Joi.object({
            platform: Joi.string(),
            rid: Joi.string()
        });
        const { error, value } = schema.validate(params);
        if (error) {
            throw new Error(error);
        }
        return await this.data.getRealUrl(value);
    };
}

module.exports = page;