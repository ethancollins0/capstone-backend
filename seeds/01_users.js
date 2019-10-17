const bcrypt = require('bcrypt')

exports.seed = function(knex) {
  return knex('data').del()
    .then(() => knex('systems').del())
    .then(() => {
      return knex('users').del()
        .then(function () {
      // Inserts seed entries
        return knex('users').insert([
          {name: "Bill", email: "bill@gmail.com", password: bcrypt.hashSync("password", 10)},
        ]);
      });
    })
};
