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

module.exports = {
    list,
    listOnDate,
};