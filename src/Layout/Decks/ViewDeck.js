import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link, useHistory, useParams } from "react-router-dom";
import { deleteDeck, readDeck } from "../../utils/api";

import ListCards from "./ListCards.js";

function ViewDeck({ updateCount }) {
  const { deckId } = useParams();
  const [deck, setDeck] = useState({});
  const [cardCount, setCardCount] = useState(0);
  const history = useHistory();

  //Used to refresh component
  const updateCardCount = (val) => {
    setCardCount(() => cardCount + val);
  };

  //Get deck on mount
  useEffect(() => {
    const abortController = new AbortController();

    async function getDeck() {
      try {
        const response = await readDeck(deckId, abortController.signal);
        setDeck({ ...response });
      } catch (err) {
        if (err.name === "AbortError") {
          console.log("Aborted getDeck() in ViewDeck");
        } else {
          throw err;
        }
      }
    }

    getDeck();

    return () => abortController.abort();
  }, [cardCount]);

  //Delete deck handler
  async function handleDeleteClick() {
    const confirmDelete = window.confirm(
      `Delete this deck? \n\nYou will not be able to recover it.`
    );

    if (confirmDelete) {
      await deleteDeck(deckId);
      updateCount(-1);
      history.push("/");
    }
  }

  //Display message if there are no cards in the deck.
  function NoCards() {
    if (!deck.cards.length) {
      return <li className="list-group-item">There are no cards in this deck.</li>;
    } else {
      return null;
    }
  }

  //Await deck info
  if (deck.id) {
    return (
      <Fragment>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/">
                <i className="bi bi-house-door-fill"></i> Home
              </Link>
            </li>
            <li className="breadcrumb-item active">{deck.name}</li>
          </ol>
        </nav>
        <div>
          <h2>{deck.name}</h2>
          <p>{deck.description}</p>
        </div>
        <div className="d-flex mb-3">
          <Link to={`/decks/${deckId}/edit`} type="button" className="btn btn-secondary">
            <i className="bi bi-pencil-fill"></i> Edit
          </Link>
          <Link type="button" className="btn btn-primary mx-2" to={`/decks/${deckId}/study`}>
            <i className="bi bi-journal-check"></i> Study
          </Link>
          <Link
            type="button"
            className="btn btn-primary"
            to={`/decks/${deckId}/cards/new`}
          >
            <i className="bi bi-plus"></i> Add Cards
          </Link>
          <button
            type="button"
            className="btn btn-danger ml-auto mr-2"
            onClick={() => handleDeleteClick()}
          >
            <i className="bi-trash" role="img"></i> Delete
          </button>
        </div>
        <div>
          <h3>Cards</h3>
          <ul className="list-group">
            <NoCards />
            {deck.cards.map(({ id, front, back, deckId }) => {
              return (
                <ListCards
                  key={id}
                  id={id}
                  front={front}
                  back={back}
                  deckId={deckId}
                  updateCardCount={updateCardCount}
                />
              );
            })}
          </ul>
        </div>
      </Fragment>
    );
  } else {
    return (
      <p>
        <i className="bi bi-hourglass-split"></i>Fetching data...
      </p>
    );
  }
}

ViewDeck.propTypes = {
  updateCount: PropTypes.func,
};

export default ViewDeck;
