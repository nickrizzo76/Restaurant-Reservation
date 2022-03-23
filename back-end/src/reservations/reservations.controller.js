const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

// list reservations
async function list(req, res, next) {
  // list reservations only on the date passed in the query
  const date = req.query.reservationDate;
  if (date) {
    data = await service.listOnDate(date);
    return res.json({ data });
  }
  // list all reservations (no date given)
  data = await service.list();
  return res.json({ data });
}

// checks if body contains the property.  Does NOT validate the property
function bodyHas(propertyName) {
  return function (req, _res, next) {
    const { body = {} } = req;
    if (body[propertyName]) return next();
    next({
      status: 400,
      message: `Reservation must include a ${propertyName}`,
    });
  };
}

function nameIsValid() {
  return function (req, _res, next) {
    const { first_name, last_name } = req.body;
    if (first_name.length < 2 || last_name.length < 2) {
      next({
        status: 400,
        message: `"${first_name} ${last_name}" is invalid. Both names must be longer than 2 characters`,
      });
    }
    next();
  };
}

// Validate that reservation is in the future and not a Tuesday
function reservationDateTimeIsValid() {
  return function (req, _res, next) {
    const { reservation_date, reservation_time } = req.body;
    const dateTime = new Date(`${reservation_date}T${reservation_time}`);
    if (dateTime < new Date()) {
      next({
        status: 400,
        message: "Reservation must be set in the future",
      });
    }

    if (dateTime.getUTCDay() === 2) {
      next({
        status: 400,
        message: "No reservations available on Tuesday.",
      });
    }
    next();
  };
}

// Validate that reservation time is within open hours
function reservationTimeIsValid() {
  return function (req, _res, next) {
    const { reservation_time } = req.body;
    const hour = parseInt(reservation_time.split(":")[0]);
    const mins = parseInt(reservation_time.split(":")[1]);
    if (hour <= 10 && mins <= 30) {
      next({
        status: 400,
        message: "Restaurant is only open after 10:30 am",
      });
    }

    if (hour >= 22) {
      next({
        status: 400,
        message: "Restaurant is closed after 10:00 pm",
      });
    }
    next();
  };
}

function peopleIsValid() {
  return function (req, res, next) {
    const { people } = req.body;
    if (!Number(people)) {
      next({
        status: 400,
        message: `${people} is an invalid party size`,
      });
    }
    next();
  };
}

// create a reservation
async function createReservation(req, res, next) {
  const data = await service.create(req.body);
  if (data) return res.json({ data });
  next({
    status: 500,
    message: "Failed to create reservation",
  });
}

module.exports = {
  create: [
    bodyHas("first_name"),
    bodyHas("last_name"),
    bodyHas("mobile_number"),
    bodyHas("reservation_date"),
    bodyHas("reservation_time"),
    bodyHas("people"),
    nameIsValid(),
    reservationDateTimeIsValid(),
    reservationTimeIsValid(),
    peopleIsValid(),
    asyncErrorBoundary(createReservation),
  ],
  list: asyncErrorBoundary(list),
};
