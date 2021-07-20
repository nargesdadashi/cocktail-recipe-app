import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";
import Styles from "../style/DrinkCard.module.scss";

interface HomeProps {
  id: string;
  name: string;
  picture: string;
  strAlcoholic: string;
}

const DrinkCard = ({ id, name, picture, strAlcoholic }: HomeProps) => {
  const history = useHistory();
  const handleClickCard = useCallback(() => {
    history.push({
      pathname: `/drink/${name.replace(/\s+/g, "-").toLowerCase()}`,
      state: { id: id },
    });
  }, [id, name, history]);

  return (
    <div onClick={handleClickCard} className={Styles.card}>
      <img alt={name} src={picture} className={Styles.cardPicture} />
      <div className={Styles.cardContent}>
        <p className={Styles.title}>{name}</p>
        <p className={Styles.strAlcoholic}>{strAlcoholic}</p>
      </div>
    </div>
  );
};

export default DrinkCard;
