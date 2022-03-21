const knex = require("../db/connection");

const tableName = "reservations";

function list() {
    return knex(tableName).select("*");
}

function listOnDate(reservation_date) {
    return knex(tableName)
    .select("*")
    .where({reservation_date});
}

function create(reservation) {
    return knex(tableName)
        .insert(reservation)
        .returning("*")
        .then((createdRecords) => createdRecords[0]);
}

module.exports = {
    create,
    list,
    listOnDate,
};