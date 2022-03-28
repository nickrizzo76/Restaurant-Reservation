const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

function reservationExists() {
  return async function (req, res, next) {
    const reservation = await service.read(req.params.reservation_id);
    if (reservation) {
      res.locals.reservation = reservation;
      return next();
    }
    next({
      status: 404,
      message: `${req.params.reservation_id}`,
    });
  };
}

function read(_req, res, _next) {
  res.json({ data: res.locals.reservation });
}

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
function bodyHasData(req, res, next) {
  const { data } = req.body;
  if (!data)
    next({
      status: 400,
    });
  next();
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
  return function (req, res, next) {
    const { reservation_time } = req.body.data;
    const error = {
      status: 400,
      message: "reservation_time",
    };
    if (!reservation_time) return next(error);
    // reservation_time exists, attempt to parse the time
    const hour = parseInt(reservation_time.split(":")[0]);
    const mins = parseInt(reservation_time.split(":")[1]);
    if (!hour || !mins) return next(error);
    res.locals.hour = hour;
    res.locals.mins = mins;
    next();
  };
}

function peopleIsValid() {
  return function (req, _res, next) {
    const { people } = req.body.data;
    if (!people || typeof people !== "number" || people <= 0) {
      return next({
        status: 400,
        message: `people`,
      });
    }
    next();
  };
}

function newReservationStatusIsValid() {
  return function (req, _res, next) {
    const { status } = req.body.data;
    // status on creation should be 'booked'
    if (!status || status !== "booked")
      return next({
        status: 400,
        message: `${status}`,
      });
    next();
  };
}

function reservationDateIsInTheFuture() {
  return function (req, _res, next) {
    const { reservation_date, reservation_time } = req.body.data;
    const dateTime = new Date(`${reservation_date}T${reservation_time}`);
    if (dateTime < new Date()) {
      return next({
        status: 400,
        message: "Reservation must be in the future",
      });
    }
    next();
  };
}

function reservationDateIsNotTuesday() {
  return function (req, _res, next) {
    const { reservation_date } = req.body.data;
    const day = new Date(reservation_date).getUTCDay();
    if (day === 2)
      return next({
        status: 400,
        message: "closed",
      });
    next();
  };
}

function reservationIsDuringOpenHours() {
  return function (_req, res, next) {
    const { hour, mins } = res.locals;
    if (hour >= 22 || (hour <= 10 && mins <= 30)) {
      return next({
        status: 400,
        message: "Not open during those hours",
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

function newStatusForExistingReservationIsValid(req, res, next) {
  const { status } = req.body.data;
  if (status && status === "booked" || status === "seated" || status === "finished")
    return next();
  next({
    status: 400,
    message: status,
  });
}

function reservationIsNotFinished(_req, res, next) {
  if (res.locals.reservation.status === "finished")
    return next({
      status: 400,
      message: "finished",
    });
  next();
}

async function update(req, res, next) {
  const { status } = req.body.data;
  const reservation = res.locals.reservation;
  reservation.status = status;
  const data = await service.update(res.locals.reservation);
  res.json({ data });
}

module.exports = {
  create: [
    bodyHasData,
    nameIsValid(),
    mobileNumberIsValid(),
    reservationDateIsValid(),
    reservationTimeIsValid(),
    peopleIsValid(),
    newReservationStatusIsValid(),
    reservationDateIsInTheFuture(),
    reservationDateIsNotTuesday(),
    reservationIsDuringOpenHours(),
    asyncErrorBoundary(createReservation),
  ],
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(reservationExists()), read],
  update: [
    bodyHasData,
    asyncErrorBoundary(reservationExists()),
    reservationIsNotFinished,
    newStatusForExistingReservationIsValid,
    asyncErrorBoundary(update),
  ],
};
