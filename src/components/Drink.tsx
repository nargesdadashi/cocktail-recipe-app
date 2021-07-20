import React, { useCallback, useEffect, useState } from "react";
import instance from "../services/theCocktailDbAPI";
import { useParams, useLocation, useHistory } from "react-router-dom";
import Styles from "../style/Drink.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWineGlassAlt } from "@fortawesome/free-solid-svg-icons";

const fetchData = async (id: string) => {
  const result = await instance.get("lookup.php", {
    params: {
      i: id,
    },
  });
  return result;
};

const findID = async (name: string) => {
  const result = await instance.get("search.php", {
    params: {
      s: name.replace("-", " "),
    },
  });
  return result;
};

const findIngredient = async (name: string) => {
  const result = await instance.get("search.php", {
    params: {
      i: name,
    },
  });
  return (result?.data?.ingredients ?? [])[0] ?? {};
};

interface ParamsInterface {
  drinkName: string;
}

interface Ingredients {
  measure: string;
  name: string;
  picture: string;
  description?: string;
}

interface DetailInterface {
  name: string;
  alcoholic: string;
  glassType: string;
  instructions: string;
  ingredients: Ingredients[];
  imageSrc: string;
  tags: string;
}
interface LocationInterface {
  state: {
    id: string;
  };
}

const drinksKeyDictionary: { [key: string]: string } = {
  strDrink: "name",
  strGlass: "glassType",
  strInstructions: "instructions",
  strDrinkThumb: "imageSrc",
  strIngredient: "strIngredient",
  strMeasure: "strMeasure",
  strAlcoholic: "alcoholic",
  strTags: "tags",
};

const isIngredient = (key: string): boolean => {
  return key.includes(drinksKeyDictionary.strIngredient);
};

const mapNormalKey = (
  key: string,
  value: string
): { [key: string]: string } => {
  const mappedKey = drinksKeyDictionary[key] ?? null;
  if (mappedKey)
    return {
      [mappedKey]: value,
    };
  return {};
};

const mapIngredient = (
  data: {
    [key: string]: string;
  },
  key: string,
  value: string
): Ingredients | null => {
  if (value === null) return null;

  const [, index] = key.split(drinksKeyDictionary.strIngredient);
  const measure = data[`${drinksKeyDictionary.strMeasure}${index}`];

  return {
    measure,
    name: value,
    picture: `https://www.thecocktaildb.com/images/ingredients/${value}.png`,
  } as Ingredients;
};

const mapDescription = async (data: DetailInterface) => {
  const updatedIngeredients = [];
  for (let value of data.ingredients) {
    const res = await findIngredient(value?.name ?? "");
    const description = res?.strDescription ?? "No description";

    updatedIngeredients.push({
      ...value,
      description,
    });
  }

  return {
    ...data,
    ingredients: updatedIngeredients,
  };
};

const normalizeDrinksData = async (data: {
  [key: string]: string;
}): Promise<DetailInterface> => {
  const normalizedData: DetailInterface = Object.entries(data).reduce(
    (prev, [key, value]) => {
      if (isIngredient(key)) {
        const mappedIngredient = mapIngredient(data, key, value);
        const currentIngredients = prev?.ingredients ?? [];

        if (mappedIngredient)
          return {
            ...prev,
            ingredients: [...currentIngredients, mappedIngredient],
          } as DetailInterface;

        return prev;
      }

      return {
        ...prev,
        ...mapNormalKey(key, value),
      };
    },
    {} as DetailInterface
  );

  const mappedDescription = await mapDescription(normalizedData);
  return mappedDescription;
};

const Drink: React.FC = () => {
  const { drinkName } = useParams<ParamsInterface>();
  const { state }: LocationInterface = useLocation();
  const [id, setId] = useState("");
  const history = useHistory();
  const [details, setDetail] = useState<DetailInterface | null>(null);

  const handleClickIngredient = useCallback(
    (name: string) => {
      history.push({
        pathname: `/ingredient/${name.replace(/\s+/g, "-").toLowerCase()}`,
      });
    },
    [history]
  );

  const handleData = async (id: string) => {
    const { data } = await fetchData(id);
    const drinkData = await normalizeDrinksData(data.drinks[0]);

    setDetail(drinkData);
  };

  useEffect(() => {
    if (state && state.id) {
      setId(state.id);
    } else {
      findID(drinkName).then((res) => {
        if (
          res.data.drinks[0].strDrink.replace(/\s+/g, "-").toLowerCase() ===
          drinkName
        ) {
          setId(res.data.drinks[0].idDrink);
        } else {
          history.push({
            pathname: `/404`,
          });
        }
      });
    }
  }, [state, drinkName, history]);

  useEffect(() => {
    if (id) {
      handleData(id);
    }
  }, [id]);

  return (
    <React.Fragment>
      {details && (
        <div className={Styles.drinkDetails}>
          <div
            className={Styles.image}
            style={{ backgroundImage: `url(${details?.imageSrc})` }}
          ></div>
          <div className={Styles.details}>
            <h2>{details?.name}</h2>
            <div className={Styles.labels}>
              <div>
                <h6>{details?.alcoholic}</h6>
              </div>

              <div className={Styles.glass}>
                <FontAwesomeIcon icon={faWineGlassAlt}></FontAwesomeIcon>
                <h6>{details?.glassType}</h6>
              </div>

              {details?.tags?.split(",").map((t, i) => (
                <div className={Styles.tag} key={`${i}`}>
                  {" "}
                  {t}
                </div>
              ))}
            </div>

            <h4>Ingredients</h4>
            {details?.ingredients.map((item, i) => (
              <div
                onClick={() => handleClickIngredient(item.name)}
                className={Styles.ingredient}
                key={`${i}`}
              >
                <span>{item.measure} </span>
                <span className={Styles.tooltip}>
                  {item.name}
                  <div className={Styles.tooltipBox}>
                    <img alt={item.name} src={item.picture} />
                    {item?.description && (
                      <p>
                        {item?.description?.substring(0, 200) +
                          (item?.description.length > 200 ? "..." : "")}
                      </p>
                    )}
                  </div>
                </span>
              </div>
            ))}
            <h4>Instructions</h4>
            <p>{details?.instructions}</p>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default Drink;
