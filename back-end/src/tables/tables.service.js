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
        .list("*")
        .where({ table_id: table_id })
        .first();
}

module.exports = {
  list,
  create,
  read
};
