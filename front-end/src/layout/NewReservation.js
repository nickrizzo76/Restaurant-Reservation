import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createReservation } from "../utils/api";
//import { today, formatAsTime } from "../utils/date-time";
/**
 * Defines the new reservation for this application.
 *
 * @returns {JSX.Element}
 */

function NewReservation({ date }) {
  const history = useHistory();
  const time = new Date()
  // let hour = Number(time.getHours());
  // let closestQuarterHour = Math.ceil(Number(time.getMinutes()) / 15) * 15;
  // if(closestQuarterHour == 60) {

  // }
  // console.log(closestQuarterHour)
  const timeString = (`${time.getHours()}:${time.getMinutes()}`)
  //console.log(time.getHours(), time.getMinutes())
  const initalFormState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: date,
    reservation_time: timeString,
    people: 1,
    status: null
  };

  console.log(initalFormState)

  const [reservationData, setReservationData] = useState({ ...initalFormState });
  const [reservationsError, setReservationsError] = useState(null);

  const handleChange = ({ target }) => {
    console.log(target.name)
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
            name="first_name"
            type="text"
            onChange={handleChange}
            value={reservationData.first_name}
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
            value={reservationData.last_name}
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
            value={reservationData.mobile_number}
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
            value={reservationData.reservation_date}
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
            value={reservationData.reservation_time}
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
