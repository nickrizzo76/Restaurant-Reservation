import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { next, previous, today } from "../utils/date-time"

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationDate, setReservationDate] = useState(date);
  const [reservationsError, setReservationsError] = useState(null);

  useEffect(loadDashboard, [reservationDate]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ reservationDate }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }


  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for date</h4>
      </div>
      <ErrorAlert error={reservationsError} />
      {reservations.length > 0 ? JSON.stringify(reservations) : <p>There are currently no reservations for {reservationDate}</p>}
      <button type="button" onClick={() => {setReservationDate(previous(reservationDate))}} className="btn btn-primary">
        Yesterday
      </button>
      <button type="button" onClick={() => {setReservationDate(today(reservationDate))}} className="btn btn-primary">
        Today
      </button>
      <button type="button" onClick={() => {setReservationDate(next(reservationDate))}} className="btn btn-primary">
        Tomorrow
      </button>

    </main>
  );
}

export default Dashboard;
