import { useState } from "react";
import styles from "./SearchBar.module.scss";
import { SearchState } from "../../../models/SearchState";

interface SearchBarProps {
  searchState: SearchState;
  setSearchState: (searchState: SearchState) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchState,
  setSearchState,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const searchQueryEntered = searchQuery.length > 0;

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div id={styles.search_bar}>
      <input
        onChange={handleInputChange}
        type="text"
        placeholder="Search for an artist"
      />
      <button
        disabled={!searchQueryEntered}
        onClick={() => {
          setSearchState({
            ...searchState,
            isSearching: true,
            searchQueryFromUser: searchQuery,
          });
          console.log(" 🔍 Beginning Search...");
        }}
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;
