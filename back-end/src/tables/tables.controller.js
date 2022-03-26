const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

function bodyHasData() {
  return function (req, _res, next) {
    const { data } = req.body;
    if (!data)
      next({
        status: 400,
        message: "body"
      });
    next();
  };
}

function bodyHasReservationId() {
    return function (req, res, next) {
        const { reservation_id } = req.body.data;
        if(!reservation_id) return next({
            status: 400,
            message: "reservation_id"
        })
        res.locals.reservation_id = reservation_id;
        next();
    }
}

function nameIsValid() {
    return function (req, _res, next) {
        const { table_name } = req.body.data;
        if(!table_name || !table_name.length || table_name.length === 1) return next({ status: 400, message: "table_name" })
        next();
    }
}

function capacityIsValid() {
    return function (req, _res, next) {
        const { capacity } = req.body.data;
        if(!capacity || (typeof capacity !== 'number')) next({status: 400, message: "capacity"})
        next();
    }
}

function tableExists() {
    return async function(req, res, next) {
        const { table_id } = req.params;
        const table = await service.read(table_id)
        if(table) {
            res.locals.table = table;
            return next()
        }
        next({
            status: 404,
            message: "table_id"
        })
    }
}

async function create(req, res, _next) {
  res.status(201).json({ data: await service.create(req.body.data) });
}

async function list(_req, res, _next) {
  res.json({ data: await service.list() });
}

// function read(_req, res, _next) {
//     res.json({ data: res.locals.table });
// }

async function update(_req, res, _next) {
    res.json({ data: {} });
}

module.exports = {
  // list: asyncErrorBoundary(list),
  create: [bodyHasData(), nameIsValid(), capacityIsValid(), asyncErrorBoundary(create)],
  list: asyncErrorBoundary(list),
  update: [
    bodyHasData(),
    bodyHasReservationId(),
    asyncErrorBoundary(tableExists()),
    asyncErrorBoundary(update)
  ]
};
