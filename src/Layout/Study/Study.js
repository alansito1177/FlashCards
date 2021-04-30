import React, { Fragment, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { readDeck } from "../../utils/api";
import StudyCard from "./StudyCard";

function Study() {
  const { deckId } = useParams();
  const [deck, setDeck] = useState({});

  useEffect(() => {
    const abortController = new AbortController();

    //Get deck on mount
    async function getDeck() {
      try {
        const response = await readDeck(deckId, abortController.signal);
        await setDeck({ ...response });
      } catch (err) {
        if (err.name === "AbortError") {
          console.log("Aborted getDeck() in Study");
        } else {
          throw err;
        }
      }
    }

    getDeck();

    return () => abortController.abort();
  }, []);

  //Conditional render/loading
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
            <li className="breadcrumb-item active">Study</li>
          </ol>
        </nav>
        <h2>Study: {deck.name}</h2>
        <StudyCard cards={deck.cards}/>
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

export default Study;
