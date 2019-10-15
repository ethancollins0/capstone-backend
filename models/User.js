const { Model } = require('objection')
const knex = require('../knex')

Model.knex(knex)

class User extends Model {
    static get tableName(){
        return 'users'
    }

    static get relationMappings(){
        const System = require('./System')
        return {
            systems: {
                relation: Model.HasManyRelation,
                modelClass: System,
                join: {
                    from: 'users.id',
                    to: 'systems.user_id'
                }
            }
        }
    }
}

module.exports = User