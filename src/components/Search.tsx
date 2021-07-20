import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Styles from "../style/Search.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

interface SearchProps {
  by?: string;
  text?: string;
}

const Search = ({ by, text }: SearchProps) => {
  const [inputText, setInputText] = useState("");
  const [searchBy, setSearchBy] = useState<string>("name");

  const history = useHistory();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const handleSelectSearchByChange = (value: string) => {
    setSearchBy(value);
  };

  const handleSearch = () => {
    history.push({
      pathname: `/search/${searchBy}/${inputText}`,
    });
  };

  useEffect(() => {
    if (by) {
      setSearchBy(by);
    }
    if (text) {
      setInputText(text);
    }
  }, [by, text]);

  return (
    <div className={Styles.searchBox}>
      <div className={Styles.searchByButtons}>
        <button
          className={searchBy === "name" ? Styles.selected : ""}
          onClick={() => handleSelectSearchByChange("name")}
        >
          Cocktail Name
        </button>
        <button
          className={searchBy === "ingredient" ? Styles.selected : ""}
          onClick={() => handleSelectSearchByChange("ingredient")}
        >
          Ingredient
        </button>
      </div>

      <div className={Styles.searchInput}>
        <input
          placeholder="search"
          onChange={handleInputChange}
          value={inputText}
          onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter" && inputText) {
              handleSearch();
            }
          }}
        />
        <FontAwesomeIcon
          className={Styles.searchIcon}
          icon={faSearch}
          onClick={handleSearch}
        ></FontAwesomeIcon>
      </div>
    </div>
  );
};

export default Search;
