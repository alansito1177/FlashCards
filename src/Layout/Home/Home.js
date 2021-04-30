import React, { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { listDecks } from "../../utils/api";

import ListDecks from "./ListDecks.js";

function Home({ deckCount, updateCount }) {
  const [decks, setDecks] = useState([]);

  useEffect(() => {
    const abortController = new AbortController();

    async function getDecks() {
      try {
        const response = await listDecks(abortController.signal);

        setDecks(response);
      } catch (err) {
        if (err.name === "AbortError") {
          console.log("Aborted getDecks() in Home");
        } else {
          throw err;
        }
      }
    }

    getDecks();
    return () => abortController.abort();
  }, [deckCount]);

  //Conditional render/loading
  if (decks) {
    return (
      <Fragment>
        <Link type="button" className="btn btn-secondary mb-2" to="/decks/new">
        <span class="oi oi-plus"></span> Create Deck
        </Link>
        {decks.map(({ id, name, description, cards }) => {
          return (
            <ListDecks
              key={id}
              id={id}
              name={name}
              description={description}
              cards={cards}
              updateCount={updateCount}
            />
          );
        })}
      </Fragment>
    );
  } else {
    return (
      <p>
        <span class="oi oi-clock"></span>Fetching data...
      </p>
    );
  }
}

Home.propTypes = {
  deckCount: PropTypes.number,
  updateCount: PropTypes.func,
};

export default Home;
