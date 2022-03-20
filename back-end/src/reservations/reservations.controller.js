const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

/**
 * List handler for reservation resources
 */
async function list(req, res, next) {
  const date  = req.query.reservationDate;
  if (date) {
    data = await service.listOnDate(date);
    return res.json({ data });
  }
  data = await service.list();
  return res.json({ data });
}

async function create(req, res, next) {
  res.status(200)
}

module.exports = {
  list,
  create, 
};
