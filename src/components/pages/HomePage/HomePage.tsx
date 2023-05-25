import { useEffect, useState } from "react";
import styles from "./HomePage.module.scss";
import { authorizeAndGatherUserData } from "../../../services/spotify/spotify_auth";
import {
  fetchFollowedArtists,
  fetchProfile,
  fetchTopArtists,
  fetchTopTracks,
} from "../../../services/spotify/spotify";
import { UserProfile } from "../../../models/UserProfile";
import { initialUserProfile } from "./HomePage.helpers";
import GenericError from "../../molecules/GenericError/GenericError";
import Profile from "../../molecules/Profile/Profile";
import Category from "../../molecules/Category/Category";
import FilterableCategory from "../../molecules/FilterableCategory/FilterableCategory";
import SearchBar from "../../molecules/SearchBar/SearchBar";
import SearchPage from "../SearchPage/SearchPage";
import { SearchState, defaultSearchState } from "../../../models/SearchState";

const errorDebugLogString = "❌==========Error==========❌";

export type Category = "You" | "Discover" | "Search" | "Genres";

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [user, setUser] = useState<UserProfile>(initialUserProfile);
  const [searchState, setSearchState] =
    useState<SearchState>(defaultSearchState);
  const [category, setCategory] = useState<Category>("You");

  useEffect(() => {
    // Fetch User's Followed Artists, Top Artists, and Top Tracks from Spotify
    const fetchUsersSpotifyData = async (profile: UserProfile) => {
      try {
        console.log(
          " ➡️ Fetching User's Followed Artists, Top Artists, and Top Tracks from Spotify..."
        );
        const [
          followedArtists,
          shortTimeRangeTopArtists,
          mediumTimeRangeTopArtists,
          longTimeRangeTopArtists,
          shortTimeRangeTopTracks,
          mediumTimeRangeTopTracks,
          longTimeRangeTopTracks,
        ] = await Promise.all([
          fetchFollowedArtists(),
          fetchTopArtists("short_term"),
          fetchTopArtists("medium_term"),
          fetchTopArtists("long_term"),
          fetchTopTracks("short_term"),
          fetchTopTracks("medium_term"),
          fetchTopTracks("long_term"),
        ]);
        const newUser = {
          ...profile,
          followedArtists,
          topArtists: {
            shortTerm: shortTimeRangeTopArtists,
            mediumTerm: mediumTimeRangeTopArtists,
            longTerm: longTimeRangeTopArtists,
          },
          topTracks: {
            shortTerm: shortTimeRangeTopTracks,
            mediumTerm: mediumTimeRangeTopTracks,
            longTerm: longTimeRangeTopTracks,
          },
        };
        setUser(newUser);
        console.log(
          " ✅ Successfully Updated User's Top Artists/Tracks and Followed Artist"
        );
        setIsLoading(false);
      } catch (error) {
        console.log(errorDebugLogString, error);
        setIsError(true);
      }
    };

    const fetchProfileData = async () => {
      // Authorize User
      await authorizeAndGatherUserData();

      // Fetch User's Profile from Spotify
      await fetchProfile()
        .then(async (profile) => {
          await fetchUsersSpotifyData(profile);
        })
        .catch((error) => {
          console.log(errorDebugLogString, error);
          setIsError(true);
        });
    };

    // fetchProfileData();
  }, []);

  if (isError) {
    return <GenericError setIsError={setIsError} />;
  }

  if (searchState.isSearching) {
    return (
      <SearchPage searchState={searchState} setSearchState={setSearchState} />
    );
  }

  return isLoading ? (
    <div id={styles.loading}>
      <img src="/loading.gif" alt="Loading" />
    </div>
  ) : (
    // No error and not loading
    <div id={styles.home_wrapper}>
      <nav id={styles.navbar}></nav>
      <section id={styles.main}>
        <Profile profile={user} setCategory={setCategory} category={category} />
      </section>
      <aside id={styles.creation_station}>
        <div id={styles.sticky}>Sticky</div>
      </aside>
    </div>
  );
};

export default HomePage;
