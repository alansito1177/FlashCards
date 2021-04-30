import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link, useHistory, useParams } from "react-router-dom";

function StudyCard({ cards }) {
  const { deckId } = useParams();
  const [study, setStudy] = useState({ isFlipped: false, cardIndex: 0 });
  const history = useHistory();

  //Next button handler
  const handleNextClick = () => {
    if (study.cardIndex < cards.length - 1) {
      setStudy({
        ...study,
        isFlipped: false,
        cardIndex: study.cardIndex + 1,
      });
    } else {
      window.confirm(
        "Restart cards?\n\nClick 'cancel' to return to the home page."
      )
        ? setStudy({ isFlipped: false, cardIndex: 0 })
        : history.push("/");
    }
  };

  //Check for amount of cards in deck
  if (cards.length > 2) {
    return (
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">
            Card {study.cardIndex + 1} of {cards.length}
          </h5>
          <p className="card-text">
            {study.isFlipped
              ? cards[study.cardIndex].back
              : cards[study.cardIndex].front}
          </p>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setStudy({ ...study, isFlipped: !study.isFlipped })}
          >
            Flip
          </button>
          {study.isFlipped && (
            <button
              type="button"
              className="btn btn-primary ml-2"
              onClick={handleNextClick}
            >
              Next
            </button>
          )}
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <h3>Not enough cards.</h3>
        <p>
          You need at least 3 cards to study. There are {cards.length} cards in
          this deck.
        </p>
        <Link
          type="button"
          className="btn btn-primary"
          to={`/decks/${deckId}/cards/new`}
        >
          <i className="bi bi-plus"></i> Add Cards
        </Link>
      </div>
    );
  }
}

StudyCard.propTypes = {
  cards: PropTypes.array,
};

export default StudyCard;
