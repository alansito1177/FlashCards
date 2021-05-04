import React, { Fragment, useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { createCard, readCard, readDeck, updateCard } from "../utils/api";

function CardForm() {
  const { deckId, cardId } = useParams();
  const [card, setCard] = useState({ front: "", back: "" });
  const [deck, setDeck] = useState({});
  const history = useHistory();
// **Fixed dependencies array
  useEffect(() => {
    const abortController = new AbortController();

    //Get deck on mount
    async function getDeck() {
      try {
        const response = await readDeck(deckId, abortController.signal);
        await setDeck({ ...response });
      } catch (err) {
        if (err.name === "AbortError") {
          console.log("Aborted getDeck() in CardForm");
        } else {
          throw err;
        }
      }
    }

    //Get card on mount if cardId present
    async function getCard() {
      try {
        const response = await readCard(cardId, abortController.signal);
        await setCard({ ...response });
      } catch (err) {
        if (err.name === "AbortError") {
          console.log("Aborted getCard() in CardForm");
        } else {
          throw err;
        }
      }
    }

    getDeck();

    if (cardId) {
      getCard();
    }

    return () => abortController.abort();
  }, []);

  //Handle text change
  const handleChange = ({ target }) => {
    if (target.id === "frontInput") {
      setCard({
        ...card,
        front: target.value,
      });
    } else {
      setCard({
        ...card,
        back: target.value,
      });
    }
  };

  //Done/cancel click handler
  const handleDoneClick = () => {
    history.push(`/decks/${deckId}`);
  };

  //Form submit handler
  const handleSubmitClick = async (e) => {
    e.preventDefault();

    if (cardId) {
      await updateCard(card);
      history.push(`/decks/${deckId}`);
    } else {
      await createCard(deckId, card);
      setCard({ front: "", back: "" });
    }
  };

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
            <li className="breadcrumb-item">
              <Link to={`/decks/${deckId}`}>{deck.name}</Link>
            </li>
            <li className="breadcrumb-item active">
              {cardId ? `Edit Card ${cardId}` : `Add Card`}
            </li>
          </ol>
        </nav>
        <h2>{cardId ? `Edit Card` : `${deck.name}: Add Card`}</h2>
        <form onSubmit={handleSubmitClick}>
          <div className="form-group">
            <label htmlFor="frontInput">Front</label>
            <textarea
              className="form-control"
              id="frontInput"
              placeholder="Front side of card"
              value={card.front}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="backInput">Back</label>
            <textarea
              className="form-control"
              id="backInput"
              placeholder="Back side of card"
              value={card.back}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <div className="d-flex">
            <button
              type="button"
              className="btn btn-secondary mr-2"
              onClick={handleDoneClick}
            >
              {cardId ? "Cancel" : "Done"}
            </button>
            <button type="submit" className="btn btn-primary">
              {cardId ? "Submit" : "Save"}
            </button>
          </div>
        </form>
      </Fragment>
    );
  } else {
    <p>
      <i className="bi bi-hourglass-split"></i>Fetching data...
    </p>;
  }

  return <p>test</p>;
}

export default CardForm;
