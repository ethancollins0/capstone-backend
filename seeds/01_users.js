
exports.seed = function(knex) {
  return knex('data').del()
    .then(() => knex('systems').del())
    .then(() => {
      return knex('users').del()
        .then(function () {
      // Inserts seed entries
        return knex('users').insert([
          {name: "Bill", email: "bill@gmail.com", password: "password"},
          {name: "Sue", email: "sue@gmail.com", password: "password"},
          {name: "Meg", email: "meg@gmail.com", password: "password"},
        ]);
      });
    })
  
  // Deletes ALL existing entries
  
};
