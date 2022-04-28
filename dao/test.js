const con = shared.get('mysql');
class dao {
    async add(condition) {
        return await con('test').insert(condition);
    }

    async get() {
        return await con('test').select();
    }
}

module.exports = dao;