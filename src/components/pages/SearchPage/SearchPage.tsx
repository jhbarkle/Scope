import { useEffect, useState } from "react";
import { SearchState } from "../../../models/SearchState";
import {
  fetchArtistAlbums,
  fetchTracksFromArtistAlbums,
  search,
} from "../../../services/spotify/spotify";
import styles from "./SearchPage.module.scss";
import { SimpleArtistObject } from "../../../models/Artist";

interface SearchPageProps {
  searchState: SearchState;
  setSearchState: (searchState: SearchState) => void;
}

const SearchPage: React.FC<SearchPageProps> = ({
  searchState,
  setSearchState,
}) => {
  const [artist, setArtist] = useState<SimpleArtistObject | undefined>(
    undefined
  );
  console.log("Current Search State: ", searchState);

  useEffect(() => {
    // START HERE
    // There are too many albums that are being returned from the artist
    // It is taking too long to query all of the albums and then get the tracks from the albums
    // Maybe before we get tracks we should filter the albums to only get the ones that are with another artist

    // Get Tracks from Artist Albums
    const getAllConnectedArtist = async (albums: any) => {
      await fetchTracksFromArtistAlbums(albums);
    };

    // Get Artist Albums
    const makeOtherCalls = async (artistId: string) => {
      await fetchArtistAlbums(artistId).then((albums) => {
        console.log("AlbumCount: ", albums.length);
        const albumIds = albums.map((album: any) => album.id);
        console.log("Grabbing Tracks for: ", albumIds.length);
        getAllConnectedArtist(albumIds);
      });
    };

    // Get Artist ID
    const fetchSearchResults = async () => {
      setSearchState({
        ...searchState,
        isLoading: true,
      });
      await search(searchState.searchQueryFromUser).then(async (artist) => {
        console.log("Artist: ", artist);
        setArtist(artist);
        setSearchState({ ...searchState, artist: artist });
        if (artist) await makeOtherCalls(artist.id);
      });
      setSearchState({ ...searchState, isLoading: false });
    };

    // fetchSearchResults();
  }, []);
  return searchState.isLoading ? (
    <div id={styles.loading}>
      <img src="/loading.gif" alt="Loading" />
    </div>
  ) : (
    <div className={styles.search_page_container}>
      <h1>Search Page</h1>
      <h2>{artist?.name}</h2>
      <img src={artist?.image} alt={artist?.name} />
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
