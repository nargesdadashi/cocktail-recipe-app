import React from "react";
import { Switch, Route } from "react-router-dom";
import Home from "./components/Home";
import SearchResult from "./components/SearchResult";
import Drink from "./components/Drink";
import Ingredient from "./components/Ingredient";
import NotFound from "./components/NotFound";
import Header from "./components/Header";

function App() {
  return (
    <React.Fragment>
      <Header />

      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/search/:by/:text" component={SearchResult} />
        {/* <Route path="/search/:by/:type/:text" component={SearchResult} /> */}
        <Route path="/drink/:drinkName" component={Drink} />
        <Route path="/ingredient/:ingredientName" component={Ingredient} />
        <Route path="/404" component={NotFound} />
      </Switch>
    </React.Fragment>
  );
}

export default App;
