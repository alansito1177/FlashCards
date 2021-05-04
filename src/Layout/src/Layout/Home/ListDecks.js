import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { deleteDeck } from "../../utils/api";

function ListDecks({ id, name, description, cards, updateCount }) {
  async function handleDeleteClick() {
    const confirmDelete = window.confirm(
      `Delete this deck? \n\nYou will not be able to recover it.`
    );

    if (confirmDelete) {
      await deleteDeck(id);
      updateCount(-1);
    }
  }

  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex justify-content-between">
          <h3 className="card-title">{name}</h3>
          <p className="text-secondary">{cards.length} cards</p>
        </div>
        <p className="card-text">{description}</p>
      </div>
      <div className="d-flex mb-2">
        <Link type="button" className="btn btn-secondary ml-2" to={`/decks/${id}`}>
          <i className="bi bi-eye"></i> View
        </Link>
        <Link type="button" className="btn btn-primary mx-2" to={`/decks/${id}/study`}>
          <i className="bi bi-journal-check"></i> Study
        </Link>
        <button
          type="button"
          className="btn btn-danger ml-auto mr-2"
          onClick={() => handleDeleteClick()}
        >
          <i className="bi-trash" role="img"></i> Delete
        </button>
      </div>
    </div>
  );
}

ListDecks.propTypes = {
  id: PropTypes.number,
  name: PropTypes.string,
  description: PropTypes.string,
  cards: PropTypes.array,
  updateCount: PropTypes.func,
};

export default ListDecks;
