// get tables with seat buttons
// pressing the seat button sends the table and reservation_id to the api

import React, { useState, useEffect } from "react";
import ErrorAlert from "../ErrorAlert";
import { useHistory, useParams } from "react-router-dom";
import { listTables, seatReservation, readReservation } from "../../utils/api";

function SeatReservation() {
  const history = useHistory();
  const { reservation_id } = useParams();
  const [reservation, setReservation] = useState({});
  const [tables, setTables] = useState([]);
  const [tableId, setTableId] = useState("");
  const [error, setError] = useState({});

  useEffect(loadTables, []);
  useEffect(() => {
    readReservation(reservation_id).then(setReservation);
  }, [reservation_id]);
  
  function loadTables() {
    const abortController = new AbortController();
    setError(null);
    listTables(abortController.signal).then(setTables).catch(setError);
    return () => abortController.abort();
  }

  function changeHandler({ target: { value }}) {
    if(reservation.people > value) {
      setError(new Error(`Table capacity not big enough to fit a party of ${reservation.people}`))
    } else {
      setTableId(value);
    }
  }


  return (
    <>
      <select
        id="table_id"
        name="table_id"
        value={tableId}
        required={true}
        onChange={changeHandler}
      >
        <option value="">Table</option>
        {tables.map((table) => (
          <option key={table.table_id} value={table.table_id}>
            {table.table_name} - {table.capacity}
          </option>
        ))}
      </select>
      <button
          type="button"
          className="btn btn-secondary mr-2"
          onClick={() => history.goBack()}
        >
          Cancel
        </button>
        <ErrorAlert error={error} />
    </>
  );
}

export default SeatReservation;
