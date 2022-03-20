import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createReservation } from "../utils/api";
/**
 * Defines the new reservation for this application.
 *
 * @returns {JSX.Element}
 */

function NewReservation({ date }) {
  const history = useHistory();
  const initalFormState = {
    firstName: "",
    lastName: "",
    mobileNumber: "",
    reservationDate: date,
    reservationTime: "",
    people: 1,
  };

  const [reservationData, setReservationData] = useState({ ...initalFormState });
  const [reservationsError, setReservationsError] = useState(null);

  const handleChange = ({ target }) => {
    setReservationData({
      ...reservationData,
      [target.name]: target.value,
    });
  };

  function handleSubmit(event) {
    event.preventDefault();
    const abortController = new AbortController();
    setReservationsError(null);
    createReservation(reservationData, abortController.signal)
      .then(history.push('/dashboard'))
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  return (
    <main>
      <h1>Create Reservation</h1>
      <form name="reservation-form" onSubmit={handleSubmit}>
        <div className="form-group d-md-flex mb-3">
          <label htmlFor="first-name">First Name</label>
          <input
            id="first-name"
            name="firstName"
            type="text"
            onChange={handleChange}
            value={reservationData.firstName}
            required
          />
        </div>
        <div className="form-group d-md-flex mb-3">
          <label htmlFor="last-name">Last Name</label>
          <input
            id="last-name"
            name="lastName"
            type="text"
            onChange={handleChange}
            value={reservationData.lastName}
            required
          />
        </div>
        <div className="form-group d-md-flex mb-3">
          <label htmlFor="mobile-number">Mobile Number</label>
          <input
            id="mobile-number"
            name="mobileNumber"
            type="number"
            onChange={handleChange}
            value={reservationData.mobileNumber}
            required
          />
        </div>
        <div className="form-group d-md-flex mb-3">
          <label htmlFor="reservation-date">Date</label>
          <input
            id="reservation-date"
            name="reservationDate"
            type="date"
            onChange={handleChange}
            value={reservationData.reservationDate}
            required
          />
        </div>
        <div className="form-group d-md-flex mb-3">
          <label htmlFor="reservation-time">Time</label>
          <input
            id="reservation-time"
            name="reservationTime"
            type="time"
            onChange={handleChange}
            value={reservationData.reservationTime}
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
            value={reservationData.people}
            required
          />
        </div>
        <button
          className="btn btn-secondary mr-2"
          type="button"
          onClick={() => history.goBack()}
        >
          Cancel
        </button>
        <button className="btn btn-primary" type="submit">
          Submit
        </button>
      </form>
    </main>
  );
}

export default NewReservation;
