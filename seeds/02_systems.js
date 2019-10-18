
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('systems').del()
    .then(function () {
      // Inserts seed entries
      return knex('users')
        .then(users => {
          const user = users[0]
          return knex('systems').insert([
            {name: "first pi", description: "moisture sensor", model: 'A+', user_id: user.id},
            {name: "second pi", description: "garage door sensor", model: 'B+', user_id: user.id},
            {name: "third pi", description: "thermostat", model: 'C+', user_id: user.id},
          ]);
        })
      
    });
};
