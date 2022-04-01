import React, { useState } from "react";
import ErrorAlert from "../ErrorAlert";
import { listReservations, cancelReservation } from "../../utils/api";
import Reservation from "../Reservation/Reservation";

function Search() {
  const [reservations, setReservations] = useState([]);
  const [mobileNumber, setMobileNumber] = useState("");
  const [errors, setErrors] = useState(null);

  function handleChange({ target: { value } }) {
    setMobileNumber(value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    loadReservations();
  }

  function loadReservations() {
    listReservations({ mobileNumber })
    .then(setReservations)
    .catch(setErrors);
  }

  function onCancel(reservation_id) {
    const abortController = new AbortController();
    cancelReservation(reservation_id, abortController.signal)
      .then(loadReservations)
    return () => abortController.abort();
  }

  const reservationList = (
    <ul>
      {reservations.map((res) => (
        <li style={{ listStyleType: "none" }} key={res.reservation_id}>
          <Reservation onCancel={onCancel} reservation={res} />
        </li>
      ))}
    </ul>
  );

  return (
    <main>
      <h3>Search for reservation by phone number</h3>
      <ErrorAlert error={errors ? errors[0] : null} />
      <form onSubmit={handleSubmit}>
        <label>
          <input
            type="text"
            id="mobile_number"
            name="mobile_number"
            className="form-control"
            onChange={handleChange}
            value={mobileNumber}
            placeholder="mobile number"
          />
        </label>
        <input type="submit" value="Submit" />
      </form>
      {reservationList}
    </main>
  );
}

export default Search;
