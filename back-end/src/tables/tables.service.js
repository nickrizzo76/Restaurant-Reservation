const knex = require("../db/connection");
const tableName = "tables";

function list() {
  return knex(tableName).orderBy("table_name", "asc");
}

function create(table) {
  return knex(tableName)
    .insert(table)
    .returning("*")
    .then((createdRecords) => createdRecords[0]);
}

function read(table_id) {
    return knex(tableName)
        .select("*")
        .where({ table_id: table_id })
        .first();
}

function update(updatedTable) {
    return knex(tableName)
        .select("*")
        .where({ table_id: updatedTable.table_id })
        .update(updatedTable)
        .then(() => read(updatedTable.table_id));
}

module.exports = {
  list,
  create,
  read,
  update
};
