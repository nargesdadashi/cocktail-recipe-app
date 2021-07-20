import React, { useEffect, useState } from "react";
import Search from "./Search";
import DrinkCard from "./DrinkCard";
import instance from "../services/theCocktailDbAPI";
import Styles from "../style/Home.module.scss";

interface cardDetail {
  strDrink: string;
  strDrinkThumb: string;
  idDrink: string;
  strAlcoholic: string;
}

const fetchRandomDrink = async (index: number) => {
  const result = await instance.get("random.php", {
    params: {
      timestamp: new Date().getTime() * index, // safari's bug on caching the requests and showing same cocktail four times.
    },
  });
  return result;
};

const Home: React.FC = () => {
  const [cocktailSuggestions, setCocktailSuggestions] = useState<cardDetail[]>(
    []
  );

  useEffect(() => {
    let result: cardDetail[] = [];
    let promises = [];
    for (let i = 0; i < 4; i++) {
      promises.push(fetchRandomDrink(i));
    }
    Promise.all(promises).then((resp) => {
      const mappedResponse = resp.map((res) => ({
        strDrink: res.data?.drinks[0].strDrink,
        strDrinkThumb: res.data?.drinks[0].strDrinkThumb,
        idDrink: res.data?.drinks[0].idDrink,
        strAlcoholic: res.data?.drinks[0].strAlcoholic,
      }));
      setCocktailSuggestions(mappedResponse);
    });
  }, []);

  return (
    <div className={Styles.home}>
      <div className={Styles.intro}>
        <div>
          <h1>BE YOUR OWN BARTENDER</h1>
          <p>
            Whether you’re after a cooling summer drink on a sunny day or a
            warming festive tipple by the fire, we have a cocktail recipe for
            every occasion. So whatever you fancy, you can find its recipe by
            searching its name or ingredients that you want to be included.
          </p>
        </div>
        <div className={Styles.image}></div>
      </div>

      <div className={Styles.searchSection}>
        <Search />
      </div>

      <div className={Styles.randomDrinks}>
        <h2>Trending Recipes</h2>
        <ul>
          {cocktailSuggestions.map((cocktail) => (
            <li key={cocktail.idDrink}>
              <DrinkCard
                id={cocktail.idDrink}
                name={cocktail.strDrink}
                picture={cocktail.strDrinkThumb}
                strAlcoholic={cocktail.strAlcoholic}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Home;
