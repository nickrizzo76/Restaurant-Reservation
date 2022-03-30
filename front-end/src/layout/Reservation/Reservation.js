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
            <p>#{reservation_id} under {first_name} {last_name} ({mobile_number})</p>
            <p>For {people} on {reservation_date} at {reservation_time}</p>
        </>
    )
}

export default Reservation;