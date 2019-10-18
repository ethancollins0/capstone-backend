
exports.up = function(knex) {
    return knex.schema.createTable('systems', t => {
        t.increments('id')
        t.string('name')
        t.string('description')
        t.string('model')
        t.integer('user_id').unsigned().notNullable()
        t.foreign('user_id').references('id').inTable('users')
    })
};

exports.down = function(knex) {

};
