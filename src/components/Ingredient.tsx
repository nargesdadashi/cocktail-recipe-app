import React, { useEffect, useState } from "react";
import instance from "../services/theCocktailDbAPI";
import { useParams, useHistory } from "react-router-dom";
import Styles from "../style/Ingredient.module.scss";

interface ParamsInterface {
  ingredientName: string;
}

interface DetailInterface {
  idIngredient: string;
  strIngredient: string;
  strDescription: string;
  strAlcohol: string;
  strABV: string;
}

const findByName = async (name: string) => {
  const result = await instance.get("search.php", {
    params: {
      i: name.replace("-", " "),
    },
  });
  return (result?.data?.ingredients ?? [])[0] ?? null;
};

const Ingredient: React.FC = () => {
  const { ingredientName } = useParams<ParamsInterface>();
  const history = useHistory();
  const [detail, setDetail] = useState<DetailInterface | null>(null);

  useEffect(() => {
    findByName(ingredientName).then((res) => {
      if (res) {
        setDetail(res);
      } else {
        history.push({
          pathname: `/404`,
        });
      }
    });
  }, [ingredientName, history]);
  return (
    <React.Fragment>
      {detail?.idIngredient && (
        <div className={Styles.ingredient}>
          <img
            alt={detail?.strIngredient}
            src={`https://www.thecocktaildb.com/images/ingredients/${detail?.strIngredient}.png`}
          />
          <h4>{detail?.strIngredient}</h4>
          <p>{detail?.strDescription}</p>
        </div>
      )}
    </React.Fragment>
  );
};

export default Ingredient;
