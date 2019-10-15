const { Model } = require('objection')
const knex = require('../knex')

Model.knex(knex)

class Data extends Model {

    static get tableName(){
        return 'data'
    }

    static get relationMappings() {
        const System = require('./System')
        return {
            systems: {
                relation: Model.BelongsToOneRelation,
                modelClass: System,
                join: {
                    from: 'systems.id',
                    to: 'data.system_id'
                }
            }
        }
    }

}

module.exports = Data