import React, { useState } from "react";

/**
 * Defines the new reservation for this application.
 *
 * @returns {JSX.Element}
 */

function NewReservation() {

    const initalFormState = {
        firstName: "",
        lastName: "",
        mobileNumber: "",
        
    }
  const [data, setData] = useState({});

  const handleChange = ({ target }) => {
    setCard({
      ...card,
      [target.name]: target.value,
    });
  };

  function submitHandler(event) {
    event.preventDefault();
    event.stopPropagation();
    handleSubmit({ ...card });
    setCard({ front: "", back: "" });
  }

  return (
    <form name="card-form" onSubmit={submitHandler}>
      <p>Front</p>
      <textarea
        id="card-front"
        name="front"
        type="text"
        value={card.front}
        onChange={handleChange}
        className="form-control"
        placeholder="Front text of card"
      />
    </form>
  );
}

export default NewReservation;
