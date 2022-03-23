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
    const regex = /\w{1}/g; // match 1 word
    const cleanedFirstName = first_name.match(regex).join("");
    const cleanedLastName = last_name.match(regex).join("");
    let error = { status: 400 };
    console.log('nameIsValid()', cleanedFirstName, cleanedLastName)
    if (cleanedFirstName.length < 2) {
      console.log("first name invalid")
      error.message = `The first name you submitted (${cleanedFirstName}) must be 2 or more letters. Only letters are valid.`;
      console.log(error)
      next(error);
    }
    if (cleanedLastName.length < 1) {
      console.log("last name invalid")
      error.message = `The last name you submitted (${cleanedLastName}) must be at least 1 letter. Only letters are valid.`;
      next(error);
    }
    next();
  };
}

function mobileNumberIsValid() {
  return function (req, res, next) {
    console.log('mobileNumberIsValid()')
    next();
  }
}

function reservationDateIsValid() {
  return function (req, res, next) {
    console.log('reservationDateIsValid()')
    next();
  }
}

function reservationTimeIsValid() {
  return function (req, res, next) {
    console.log('reservationTimeIsValid()')
    next();
  }
}

function peopleIsValid() {
  return function (req, res, next) {
    console.log('peopleIsValid()')
    next();
  }
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
    mobileNumberIsValid(),
    reservationDateIsValid(),
    reservationTimeIsValid(),
    peopleIsValid(),
    asyncErrorBoundary(createReservation),
  ],
  list: asyncErrorBoundary(list),
};
