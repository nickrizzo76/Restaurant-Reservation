const knex = require("../db/connection");
const tableName = "tables";

function list() {
    return knex(tableName)
        .orderBy('table_name', 'asc')
}

module.exports = {
    list,    
};