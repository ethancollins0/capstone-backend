const knex = require('./knex')
const bcrypt = require('bcrypt')

function createPi(id, pi){
    const {name, model} = pi
    return knex('users').where({ id }).first()
        .then(user => knex('systems').returning('id').insert([{ name, model, user_id: user.id }]))
}

function deletePi(user_id, pi_id){
    return knex('systems').where({ user_id }).where({ id: pi_id })
        ? knex('systems').where({ user_id }).where({ id: pi_id }).del()
        : null
}

function getUserSystems(user_id){
    return knex('systems').where({ user_id })
}

function createUser(user) {
    const {email, name, password} = user
    return doesExist(email)
        .then(array => {
            if (array.length == 0){
                let hash = bcrypt.hashSync(password, 10)
                return knex('users').returning('id').insert({name, email, password: hash})
            } else {
                return null
            }
        })
}

function getUserById(id){
    return knex('users').where({ id }).first()
}

function doesExist(email){
    return knex('users').where({ email })
}

function verifyUser(email, password){
    return doesExist(email)
        .then(array => {
            if (array && array.length != 0){
                return knex('users').where({ email })
                    .then(users => users[0])
                    .then(user => {
                        return bcrypt.compare(password, user.password).then(res => {
                            return res
                                ? knex('users').where({ email: email }).first()
                                : null
                        })
                    })
            } else {
                return null
            }
        })
}

module.exports = {
    createPi,
    createUser,
    verifyUser,
    getUserById,
    getUserSystems,
    deletePi
}