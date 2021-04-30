import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { deleteCard } from "../../utils/api";

function ListCards({ id, front, back, deckId, updateCardCount }) {
  //Delete click handler
  async function handleDeleteClick() {
    const confirmDelete = window.confirm(
      `Delete this card? \n\nYou will not be able to recover it.`
    );

    if (confirmDelete) {
      await deleteCard(id);
      updateCardCount(-1);
    }
  }

  //Render each card item
  return (
    <li className="list-group-item">
      <div className="d-flex justify-content-between">
        <p className="mb-2">{front}</p>
        <p className="mb-2">{back}</p>
      </div>
      <div className="d-flex justify-content-end">
        <Link type="button" className="btn btn-secondary mx-2" to={`/decks/${deckId}/cards/${id}/edit`}>
          <i className="bi bi-pencil-fill"></i> Edit
        </Link>
        <button
          type="button"
          className="btn btn-danger mr-2"
          onClick={() => handleDeleteClick()}
        >
          <i className="bi-trash" role="img"></i> Delete
        </button>
      </div>
    </li>
  );
}

ListCards.propTypes = {
  id: PropTypes.number,
  front: PropTypes.string,
  back: PropTypes.string,
  deckId: PropTypes.number,
  updateCardCount: PropTypes.func,
};

export default ListCards;
