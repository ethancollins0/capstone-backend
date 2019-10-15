
exports.up = function(knex) {
  return knex.schema.createTable('data', t => {
      t.string('name')
      t.integer('system_id').unsigned().notNullable()
      t.foreign('system_id').references('id').inTable('systems')
  })
};

exports.down = function(knex) {
  
};
