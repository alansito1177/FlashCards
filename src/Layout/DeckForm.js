import React, { Fragment, useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { createDeck, readDeck, updateDeck } from "../utils/api";

function DeckForm() {
  const { deckId } = useParams();
  const [deck, setDeck] = useState({ name: "", description: "" });
  const [deckCopy, setDeckCopy] = useState({});
  const history = useHistory();

  useEffect(() => {
    const abortController = new AbortController();

    //Get deck on mount if editing deck
    async function getDeck() {
      try {
        const response = await readDeck(deckId, abortController.signal);
        await setDeck({ ...response });
        //Additional deck copy for breadcrumb navigation display
        await setDeckCopy({ ...response });
      } catch (err) {
        if (err.name === "AbortError") {
          console.log("Aborted getDeck() in DeckForm");
        } else {
          throw err;
        }
      }
    }

    if (deckId) {
      getDeck();
    }

    return () => abortController.abort();
  }, []);

  //Determine whether to display additional breadcrumb for existing deck
  function CrumbCheck() {
    if (deckId) {
      return (
        <li className="breadcrumb-item">
          <Link to={`/decks/${deckId}`}>{deckCopy.name}</Link>
        </li>
      );
    } else {
      return null;
    }
  }

  //Handle text change
  const handleChange = ({ target }) => {
    if (target.id === "name") {
      setDeck({
        ...deck,
        name: target.value,
      });
    } else {
      setDeck({
        ...deck,
        description: target.value,
      });
    }
  };

  //Cancel click handler
  const handleCancelClick = () => {
    if (deckId) {
      history.push(`/decks/${deckId}`);
    } else {
      history.push("/");
    }
  };

  //Form submit handler
  const handleSubmitClick = async (e) => {
    e.preventDefault();

    if (deckId) {
      await updateDeck(deck);
      history.push(`/decks/${deckId}`);
    } else {
      const response = await createDeck(deck);
      setDeck({ name: "", description: "" });
      history.push(`/decks/${response.id}`);
    }
  };

  return (
    <Fragment>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/">
              <i className="bi bi-house-door-fill"></i> Home
            </Link>
          </li>
          <CrumbCheck />
          <li className="breadcrumb-item">
            {deckId ? "Edit Deck" : "Create Deck"}
          </li>
        </ol>
      </nav>
      <h2>{deckId ? "Edit Deck" : "Create Deck"}</h2>
      <form onSubmit={handleSubmitClick}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            className="form-control"
            placeholder="Deck Name"
            value={deck.name}
            onChange={handleChange}
            required
          ></input>
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            className="form-control"
            placeholder="Brief description of the deck"
            value={deck.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <div className="d-flex">
          <button
            type="button"
            className="btn btn-secondary mr-2"
            onClick={handleCancelClick}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
      </form>
    </Fragment>
  );
}

export default DeckForm;
