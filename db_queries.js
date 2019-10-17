const knex = require('./knex')
const bcrypt = require('bcrypt')

function createPi(user_id, pi){
    const {name, description} = pi
    knex('systems').insert([{ name, description, user_id }])
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
    getUserById
}