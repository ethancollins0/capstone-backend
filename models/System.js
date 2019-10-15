const { Model } = require('objection')
const knex = require('../knex')

Model.knex(knex)

class System extends Model {


    static get tableName(){
        return 'systems'
    }

    static get relationMappings(){
        const User = require('./User')
        const Data = require('./Data')
        return {
            users: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'systems.user_id',
                    to: 'users.id'
                }
            },
            data: {
                relation: Model.HasOneRelation,
                modelClass: Data,
                join: {
                    from: 'data.system_id',
                    to: 'system.id'
                }
            }
        }
    }

}

module.exports = System