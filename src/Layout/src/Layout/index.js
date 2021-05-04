import React, { Fragment, useState } from "react";
import { Route, Switch } from "react-router-dom";

import CardForm from "./CardForm.js";
import DeckForm from "./DeckForm.js";
import Header from "./Header.js";
import NotFound from "./NotFound.js";
import ViewDeck from "./Decks/ViewDeck.js";
import Home from "./Home/Home.js";
import Study from "./Study/Study.js";

function Layout() {
  const [deckCount, setDeckCount] = useState(0);
  const updateCount = (val) => {
    setDeckCount(() => deckCount + val);
  };

  return (
    <Fragment>
      <Header />
      <div className="container">
        <Switch>
          <Route path="/" exact={true}>
            <Home deckCount={deckCount} updateCount={updateCount} />
          </Route>
          <Route
            path={[
              "/decks/:deckId/cards/new",
              "/decks/:deckId/cards/:cardId/edit",
            ]}
          >
            <CardForm />
          </Route>
          <Route path={["/decks/:deckId/edit", "/decks/new"]}>
            <DeckForm />
          </Route>
          <Route path="/decks/:deckId/study">
            <Study />
          </Route>
          <Route path="/decks/:deckId">
            <ViewDeck updateCount={updateCount} />
          </Route>
          <Route>
            <NotFound />
          </Route>
        </Switch>
      </div>
    </Fragment>
  );
}

export default Layout;
