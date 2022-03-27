const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const reservationsService = require("../reservations/reservations.service");

function bodyHasData() {
  return function (req, _res, next) {
    const { data } = req.body;
    if (!data) {
      next({
        status: 400,
        message: "body",
      });
    }
    next();
  };
}

function bodyHasReservationId() {
  return function (req, res, next) {
    const { reservation_id } = req.body.data;
    if (!reservation_id) {
      return next({
        status: 400,
        message: "reservation_id",
      });
    }
    res.locals.reservation_id = reservation_id;
    next();
  };
}

function nameIsValid() {
  return function (req, _res, next) {
    const { table_name } = req.body.data;
    if (!table_name || !table_name.length || table_name.length === 1) {
      return next({ status: 400, message: "table_name" });
    }
    next();
  };
}

function capacityIsValid() {
  return function (req, _res, next) {
    const { capacity } = req.body.data;
    if (!capacity || typeof capacity !== "number") {
      next({ status: 400, message: "capacity" });
    }
    next();
  };
}

function tableExists() {
  return async function (req, res, next) {
    const { table_id } = req.params;
    const table = await service.read(table_id);
    if (table) {
      res.locals.table = table;
      return next();
    }
    next({
      status: 404,
      message: "table_id",
    });
  };
}

function tableCapacityIsLargeEnough() {
  return function (_req, res, next) {
    const { capacity } = res.locals.table;
    const { people } = res.locals.reservation;
    if (capacity >= people) return next();
    next({
      status: 400,
      message: "capacity",
    });
  };
}

function tableIsOccupied() {
  return function (_req, res, next) {
    const { reservation_id } = res.locals.table;

    if (reservation_id) {
      return next({
        status: 400,
        message: "occupied",
      });
    }

    next();
  };
}

function reservationIdExists() {
  return async function (_req, res, next) {
    const reservation = await reservationsService.read(
      res.locals.reservation_id
    );
    if (!reservation) {
      return next({ status: 404, message: `${res.locals.reservation_id}` });
    }
    res.locals.reservation = reservation;
    next();
  };
}

async function create(req, res, _next) {
  res.status(201).json({ data: await service.create(req.body.data) });
}

async function list(_req, res, _next) {
  res.json({ data: await service.list() });
}

async function update(_req, res, _next) {
  const { table } = res.locals;
  table.reservation_id = res.locals.reservation_id;

  const data = await service.update(table);
  res.json({ data });
}

module.exports = {
  create: [
    bodyHasData(),
    nameIsValid(),
    capacityIsValid(),
    asyncErrorBoundary(create),
  ],
  list: asyncErrorBoundary(list),
  update: [
    bodyHasData(),
    bodyHasReservationId(),
    asyncErrorBoundary(reservationIdExists()),
    asyncErrorBoundary(tableExists()),
    tableCapacityIsLargeEnough(),
    tableIsOccupied(),
    asyncErrorBoundary(update),
  ],
};
