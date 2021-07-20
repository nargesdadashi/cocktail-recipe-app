import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import instance from "../services/theCocktailDbAPI";
import DrinkCard from "./DrinkCard";
import Search from "./Search";
import Styles from "../style/SearchResult.module.scss";

interface cardDetail {
  strDrink: string;
  strDrinkThumb: string;
  idDrink: string;
  strAlcoholic?: string;
}

interface ParamsInterface {
  by: "name" | "ingredient";
  text: string;
}

const searchByName = async (text: string) => {
  const result = await instance.get("search.php", {
    params: {
      s: text,
    },
  });
  return result;
};

const filterByIngredient = async (text: string) => {
  const result = await instance.get("filter.php", {
    params: {
      i: text,
    },
  });
  return result;
};

const reduceKeys = (array: any, keys_to_keep: string[]) => {
  const c = array.map((o: any) =>
    keys_to_keep.reduce((acc: any, curr) => {
      acc[curr] = o[curr];
      return acc;
    }, {})
  );
  return c;
};

const SearchResult: React.FC = () => {
  const { by, text } = useParams<ParamsInterface>();
  const [result, setResult] = useState<cardDetail[]>([]);

  useEffect(() => {
    const effect = async () => {
      if (by === "name") {
        const res = await searchByName(text);

        const searchRes: cardDetail[] = reduceKeys(res.data?.drinks ?? [], [
          "strDrink",
          "strDrinkThumb",
          "idDrink",
          "strAlcoholic",
        ]);
        setResult(searchRes);
      } else {
        const res = await filterByIngredient(text);
        setResult(res.data?.drinks ?? []);
      }
    };

    effect();
  }, [by, text]);

  return (
    <div>
      <div className={Styles.searchBox}>
        <Search text={text} by={by} />
      </div>
      <div className={Styles.resultBox}>
        <h4>Search result for '{text}'</h4>
        <ul>
          {result.map((drink) => (
            <li key={drink.idDrink}>
              <DrinkCard
                id={drink.idDrink}
                name={drink.strDrink}
                picture={drink.strDrinkThumb}
                strAlcoholic={drink.strAlcoholic ?? ""}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SearchResult;
