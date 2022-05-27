'use strict';

const base = shared.get('base').page;
const Joi = require('joi');

class page extends base {
    constructor(ctx) {
        super(ctx);
    }
    data = this.new_data('music');
    static map = {
        "/": {
            "get": "searchList",
        }
    }

    async searchList(params) {
        const schema = Joi.object({
            input: Joi.string(),
            rid: Joi.string()
        });
        const { error, value } = schema.validate(params);
        if (error) {
            throw new Error(error);
        }
        return await this.data.searchList(value);
    };
}

module.exports = page;