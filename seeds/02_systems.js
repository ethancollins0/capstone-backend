
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('systems').del()
    .then(function () {
      // Inserts seed entries
      return knex('users')
        .then(users => {
          const user = users[0]
          return knex('systems').insert([
            {name: "moisture", model: 'Pi 3 A+', user_id: user.id},
            {name: "second pi", model: 'Pi 3 B+', user_id: user.id},
            {name: "third pi", model: 'Pi 4 B', user_id: user.id},
          ]);
        })
      
    });
};
