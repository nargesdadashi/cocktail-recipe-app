import React from "react";
import Styles from "../style/NotFound.module.scss";
import { useHistory } from "react-router-dom";

const NotFound: React.FC = () => {
  const history = useHistory();

  return (
    <div className={Styles.notFound}>
      <h1>404</h1>
      <h2>Page not found</h2>
      <button onClick={() => history.push({ pathname: `/` })}>
        Return To Home
      </button>
    </div>
  );
};

export default NotFound;
