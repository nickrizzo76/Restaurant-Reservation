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

async function create(req, res, _next) {
  res.status(201).json({ data: await service.create(req.body.data) });
}

async function list(_req, res, _next) {
  res.json({ data: await service.list() });
}

module.exports = {
  // list: asyncErrorBoundary(list),
  create: [bodyHasData(), nameIsValid(), capacityIsValid(), asyncErrorBoundary(create)],
  list: asyncErrorBoundary(list),
};
