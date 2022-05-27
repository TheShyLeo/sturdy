const con = shared.get('mysql');
class dao {
    async add(condition) {
        return await con('music').insert(condition).onConflict('id').ignore()
    }
}

module.exports = dao;