import { useEffect, useState } from "react";
import { SearchState } from "../../../models/SearchState";
import {
  fetchFullAlbums,
  fetchArtistAlbums,
  search,
} from "../../../services/spotify/spotify";
import styles from "./SearchPage.module.scss";
import {
  ConnectedArtistObject,
  SimpleArtistObject,
} from "../../../models/Artist";
import ArtistInfo from "../../molecules/ArtistInfo/ArtistInfo";
import ConnectedArtistsCategory from "../../molecules/ConnectedArtistsCategory/ConnectedArtistsCategory";

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
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadingMessage, setLoadingMessage] = useState<string>(
    `Searching for artist ${searchState.searchQueryFromUser}... `
  );
  const [connectedArtists, setConnectedArtists] = useState<
    ConnectedArtistObject[]
  >([]);

  useEffect(() => {
    // Get Full Albums with Tracks from Artist
    const getAllConnectedArtist = async (albums: any) => {
      setLoadingMessage(
        `Getting all tracks for ${searchState.searchQueryFromUser}...`
      );
      await fetchFullAlbums(albums).then((tracks) => {
        setConnectedArtists(tracks);
        setIsLoading(false);
      });
    };

    // Get Artist Albums
    const makeOtherCalls = async (artistId: string) => {
      setLoadingMessage(
        `Getting albums for ${searchState.searchQueryFromUser}...}`
      );
      await fetchArtistAlbums(artistId).then((albums) => {
        const albumIds = albums.map((album: any) => album.id);
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
        setLoadingMessage(
          `Searching for artist ${searchState.searchQueryFromUser}...`
        );
        console.log("Artist: ", artist);
        setArtist(artist);
        setSearchState({ ...searchState, artist: artist });
        if (artist) await makeOtherCalls(artist.id);
      });
      setSearchState({ ...searchState, isLoading: false });
    };

    // fetchSearchResults();
  }, []);
  return isLoading ? (
    <div id={styles.loading}>
      <img src="/loading.gif" alt="Loading" />
      <h1>{loadingMessage}</h1>
    </div>
  ) : (
    <div className={styles.search_page_container}>
      <h1>Search Page</h1>
      <button
        onClick={() => {
          setSearchState({ ...searchState, isSearching: false });
          console.log(" 🔍 Ending Search...");
        }}
      >
        Back
      </button>
      <ArtistInfo artistName={artist?.name ?? ""} image={artist?.image ?? ""} />
      {connectedArtists && (
        <ConnectedArtistsCategory
          title={"Connected Through Music"}
          description={"Hover over images to play."}
          spotifyItems={connectedArtists}
        />
      )}
    </div>
  );
};

export default SearchPage;
