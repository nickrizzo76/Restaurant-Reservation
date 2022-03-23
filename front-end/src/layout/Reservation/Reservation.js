import React, { useEffect, useState } from "react"

/**
 * Defines a reservation list item.
 * @param reservation
 *  the reservation component for a reservation.
 * @returns {JSX.Element}
 */
function Reservation( { reservation } ) {
    const { reservation_id, first_name, last_name, mobile_number, reservation_date, reservation_time, people, status } = reservation

    return (
        <>
            <p>Id {reservation_id} under {first_name} {last_name}</p>
            <p>{mobile_number}</p>
            <p>Reservation on {reservation_date} at {reservation_time}</p>
            <p>Party of {people}</p>
        </>
    )
}

export default Reservation;