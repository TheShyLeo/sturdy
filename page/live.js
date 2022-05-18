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
        const schema = Joi.object().keys({
            platform: Joi.string(),
            rid: Joi.string()
        });
        const { error, value } = Joi.validate(params, schema);
        if (error) {
            throw new Error(error);
        }
        return await this.data.getRealUrl(value);
    };
}

module.exports = page;