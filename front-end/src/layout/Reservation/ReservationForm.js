import React, { useState, useEffect } from "react";
import ErrorAlert from "../ErrorAlert";
import { useHistory, useParams } from "react-router-dom";
import {
  createReservation,
  readReservation,
  updateReservation,
} from "../../utils/api";

/**
 * Defines the new reservation for this application.
 *
 * @returns {JSX.Element}
 */

function ReservationForm() {
  const history = useHistory();
  const { reservation_id } = useParams();

  const initalFormState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 1,
    status: null,
  };

  const [reservation, setReservation] = useState({
    ...initalFormState,
  });
  const [reservationErrors, setReservationErrors] = useState(null);

  useEffect(() => {
    if (reservation_id) {
      setReservationErrors(null);
      readReservation(reservation_id)
        .then(setReservation)
        .catch(setReservationErrors);
    }
  }, [reservation_id]);

  const handleChange = ({ target }) => {
    let { value, name } = target;
    if (name === "people") {
      setReservation({
        ...reservation,
        [name]: Number(value),
      });
      return;
    }
    if (name === "first_name" || name === "last_name") {
      const regex = /[a-zA-Z]/g; // match 1 word
      const cleanArray = value.match(regex);
      value = cleanArray ? cleanArray.join("") : "";
    }

    setReservation({
      ...reservation,
      [name]: value,
    });
  };

  function validate(reservation) {
    const errors = [];

    function isValidName({ first_name, last_name }) {
      if (first_name.length < 2) {
        errors.push(
          new Error(
            `First name '${first_name}' must be 2 or more letters and can't contain numbers or special characters.`
          )
        );
      }
      if (last_name.length < 2) {
        errors.push(
          new Error(
            `Last name '${last_name}' must be 2 or more letters and can't contain numbers or special characters.`
          )
        );
      }
    }

    function isFutureDate({ reservation_date, reservation_time }) {
      const dateTime = new Date(`${reservation_date}T${reservation_time}`);
      if (dateTime < new Date()) {
        errors.push(new Error("Reservation must be set in the future"));
      }
    }

    function isTuesday({ reservation_date }) {
      const day = new Date(reservation_date).getUTCDay();
      if (day === 2) {
        errors.push(new Error("No reservations available on Tuesday."));
      }
    }

    function isOpenHours({ reservation_time }) {
      const hour = parseInt(reservation_time.split(":")[0]);
      const mins = parseInt(reservation_time.split(":")[1]);

      if (hour <= 10 && mins <= 30) {
        errors.push(new Error("Restaurant is only open after 10:30 am"));
      }

      if (hour >= 22) {
        errors.push(new Error("Restaurant is closed after 10:00 pm"));
      }
    }

    isValidName(reservation);
    isFutureDate(reservation);
    isTuesday(reservation);
    isOpenHours(reservation);

    return errors;
  }

  function handleSubmit(event) {
    event.preventDefault();

    const errors = validate(reservation);
    if (errors.length) {
      console.log(errors);
      return setReservationErrors(errors);
    }

    const abortController = new AbortController();
    setReservationErrors(null);
    // pull reservation_id from URL params to see if the user is editing or creating a reservation
    if (reservation_id) {
      // update reservation
      updateReservation(reservation, abortController.signal)
        .then(history.push(`/dashboard/?date=${reservation.reservation_date}`))
        .catch((error) => {
          setReservationErrors(error);
        });
    } else {
      // create new reservation
    createReservation(reservation, abortController.signal)
      .then(history.push(`/dashboard/?date=${reservation.reservation_date}`))
      .catch((error) => {
        setReservationErrors(error);
      });
    return () => abortController.abort();
    }
  }

  return (
    <main>
      <ErrorAlert error={reservationErrors ? reservationErrors[0] : null} />
      <form name="reservation-form" onSubmit={handleSubmit}>
        <div className="form-group d-md-flex mb-3">
          <label htmlFor="first-name">First Name</label>
          <input
            id="first-name"
            name="first_name"
            type="text"
            onChange={handleChange}
            value={reservation.first_name}
            required
          />
        </div>
        <div className="form-group d-md-flex mb-3">
          <label htmlFor="last-name">Last Name</label>
          <input
            id="last-name"
            name="last_name"
            type="text"
            onChange={handleChange}
            value={reservation.last_name}
            required
          />
        </div>
        <div className="form-group d-md-flex mb-3">
          <label htmlFor="mobile-number">Mobile Number</label>
          <input
            id="mobile-number"
            name="mobile_number"
            type="number"
            onChange={handleChange}
            value={reservation.mobile_number}
            required
          />
        </div>
        <div className="form-group d-md-flex mb-3">
          <label htmlFor="reservation-date">Date</label>
          <input
            id="reservation-date"
            name="reservation_date"
            type="date"
            onChange={handleChange}
            value={reservation.reservation_date}
            required
          />
        </div>
        <div className="form-group d-md-flex mb-3">
          <label htmlFor="reservation-time">Time</label>
          <input
            id="reservation-time"
            name="reservation_time"
            type="time"
            onChange={handleChange}
            value={reservation.reservation_time}
            required
          />
        </div>
        <div className="form-group d-md-flex mb-3">
          <label htmlFor="people">People</label>
          <input
            id="people"
            name="people"
            type="number"
            min="1"
            onChange={handleChange}
            value={reservation.people}
            required
          />
        </div>
        <button
          type="button"
          className="btn btn-secondary mr-2"
          onClick={() => history.goBack()}
        >
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </main>
  );
}

export default ReservationForm;
