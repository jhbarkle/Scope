import { useState } from "react";
import { SearchState, defaultSearchState } from "../../../models/SearchState";
import styles from "./SearchPage.module.scss";

interface SearchPageProps {
  searchState: SearchState;
  setSearchState: (searchState: SearchState) => void;
}

const SearchPage: React.FC<SearchPageProps> = ({
  searchState,
  setSearchState,
}) => {
  console.log("Current Search State", searchState);

  return (
    <div className={styles.search_page_container}>
      <h1>Search Page</h1>;{" "}
      <button
        onClick={() => {
          setSearchState({ ...searchState, isSearching: false });
          console.log(" 🔍 Ending Search...");
        }}
      >
        Back
      </button>
    </div>
  );
};

export default SearchPage;
