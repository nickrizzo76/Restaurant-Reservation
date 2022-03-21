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
  const data = await service.create(req.body);
  if(data) return res.json({ data })
  next({
    status: 500,
    message: 'Failed to create reservation'
  })
}

module.exports = {
  list,
  create, 
};
