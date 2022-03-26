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
    return function (req, res, next) {
        const { table_name } = req.body.data;
        if(!table_name || !table_name.length || table_name.length === 1) return next({ status: 400, message: "table_name" })
        next();
    }
}

function create(req, res, next) {
  res.json({ data: {} });
}

function list(req, res, next) {
  res.json({ data: {} });
}

module.exports = {
  // list: asyncErrorBoundary(list),
  create: [bodyHasData(), nameIsValid(), asyncErrorBoundary(create)],
  list,
};
