const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

// list reservations
async function list(req, res, _next) {
  // list reservations only on the date passed in the query
  const { date } = req.query;
  if (date) {
    return res.json({ data: await service.listOnDate(date) });
  }
  // list all reservations (no date given)
  data = await service.list();
  return res.json({ data });
}

// checks if body contains data
function bodyHasData() {
  return function (req, _res, next) {
    const { data } = req.body;
    if (!data)
      next({
        status: 400,
      });
    next();
  };
}

// Validate name exists and is not empty
function nameIsValid() {
  return function (req, _res, next) {
    const { first_name, last_name } = req.body.data;
    const error = { status: 400 };
    if (!first_name || !first_name.length) {
      error.message = `first_name`;
      return next(error);
    }
    if (!last_name || !last_name.length) {
      error.message = `last_name`;
      return next(error);
    }

    next();
  };
}

// Validate mobile number exists
function mobileNumberIsValid() {
  return function (req, _res, next) {
    const { mobile_number } = req.body.data;
    if (!mobile_number)
      return next({
        status: 400,
        message: "mobile_number",
      });
    next();
  };
}

// Validate that reservation date exists and is correctly formatted
function reservationDateIsValid() {
  return function (req, _res, next) {
    const { reservation_date } = req.body.data;
    if (!reservation_date || new Date(reservation_date) == "Invalid Date")
      return next({
        status: 400,
        message: "reservation_date",
      });
    next();
  };
}

// Validate that reservation time exists and is correctly formatted
function reservationTimeIsValid() {
  return function (req, _res, next) {
    const { reservation_time } = req.body.data;
    const error = {
      status: 400,
      message: "reservation_time"
    }
    if(!reservation_time) return next(error)
    // reservation_time exists, attempt to parse the time
    const hour = parseInt(reservation_time.split(":")[0]);
    const mins = parseInt(reservation_time.split(":")[1]);
    if(!hour || !mins) return next(error)
    next();
  };
}

function peopleIsValid() {
  return function (req, _res, next) {
    const { people } = req.body.data;
    if (!people || typeof people !== 'number' || people <= 0) {
      return next({
        status: 400,
        message: `people`,
      });
    }
    next();
  };
}

// create a reservation
async function createReservation(req, res, next) {
  const data = await service.create(req.body.data);
  if (data) return res.status(201).json({ data });
  next({
    status: 500,
    message: "Failed to create reservation",
  });
}

module.exports = {
  create: [
    bodyHasData(),
    nameIsValid(),
    mobileNumberIsValid(),
    reservationDateIsValid(),
    reservationTimeIsValid(),
    peopleIsValid(),
    reservationDateIsInTheFuture(),
    asyncErrorBoundary(createReservation),
  ],
  list: asyncErrorBoundary(list),
};
