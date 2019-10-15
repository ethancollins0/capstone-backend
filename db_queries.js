const knex = require('./knex')

function createPi(user_id, pi){
    const {name, description} = pi
    knex('systems').insert([{ name, description, user_id }])
}

module.exports = {
    createPi,

}