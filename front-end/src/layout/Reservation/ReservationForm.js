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
  const [error, setError] = useState(null);

  useEffect(() => {
    if (reservation_id) {
      setError(null);
      readReservation(reservation_id)
        .then(setReservation)
        .catch(setError);
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

    setReservation({
      ...reservation,
      [name]: value,
    });
  };


  function handleSubmit(event) {
    event.preventDefault();

    console.log(reservation)

    const abortController = new AbortController();
    setError(null);
    // pull reservation_id from URL params to see if the user is editing or creating a reservation
    if (reservation_id) {
      // update reservation
      updateReservation(reservation, abortController.signal)
        .then(() => history.push(`/dashboard/?date=${reservation.reservation_date}`))
        .catch((error) => {
          setError(error);
        });
    } else {
      // create new reservation
    createReservation(reservation, abortController.signal)
      .then(() => history.push(`/dashboard/?date=${reservation.reservation_date}`))
      .catch((error) => {
        setError(error);
      });
    return () => abortController.abort();
    }
  }

  return (
    <main>
      <ErrorAlert error={error} />
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
            type="text"
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
