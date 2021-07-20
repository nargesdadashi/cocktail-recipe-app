import React from "react";
import logo from "../LogoMakr4.png";
import Styles from "../style/Header.module.scss";
import { useHistory } from "react-router-dom";

const Header: React.FC = () => {
  const history = useHistory();

  return (
    <div className={Styles.header}>
      <img
        onClick={() => history.push({ pathname: `/` })}
        src={logo}
        alt="Logo"
      />
    </div>
  );
};

export default Header;
