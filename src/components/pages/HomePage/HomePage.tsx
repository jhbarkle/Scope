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

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [user, setUser] = useState<UserProfile>(initialUserProfile);
  const errorDebugLogString = "❌==========Error==========❌";

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

    fetchProfileData();
    setIsLoading(false);
  }, []);

  if (isError) {
    return <GenericError setIsError={setIsError} />;
  }

  return isLoading ? (
    <div id={styles.loading}>
      <img src="/loading.gif" alt="Loading" />
    </div>
  ) : (
    // No error and not loading
    <div id={styles.home_wrapper}>
      {/* User Profile Info */}
      <Profile profile={user} />
      {/* Followed Artists */}
      <section>
        <Category
          title={"Followed Artists"}
          description={"Check out your favorite artists"}
          spotifyItems={user.followedArtists}
        />
      </section>
      {/* Top Artists */}
      <section>
        <h1>Top Artists</h1>
        <section>
          <h3>Last 4 Weeks</h3>
          <ul
            style={{
              listStyle: "none",
              display: "flex",
              flexWrap: "wrap",
              padding: "0",
              gap: "1rem",
            }}
          >
            {user.topArtists.shortTerm.map((artist) => {
              return (
                <li key={artist.id}>
                  <img
                    style={{ width: "100px", height: "100px" }}
                    src={artist.image}
                    alt=""
                  />
                  <p>{artist.name}</p>
                </li>
              );
            })}
          </ul>
        </section>
        <section>
          <h3>Last 6 Months</h3>
          <ul
            style={{
              listStyle: "none",
              display: "flex",
              flexWrap: "wrap",
              padding: "0",
              gap: "1rem",
            }}
          >
            {user.topArtists.mediumTerm.map((artist) => {
              return (
                <li key={artist.id}>
                  <img
                    style={{ width: "100px", height: "100px" }}
                    src={artist.image}
                    alt=""
                  />
                  <p>{artist.name}</p>
                </li>
              );
            })}
          </ul>
        </section>
        <section>
          <h3>All Time</h3>
          <ul
            style={{
              listStyle: "none",
              display: "flex",
              flexWrap: "wrap",
              padding: "0",
              gap: "1rem",
            }}
          >
            {user.topArtists.longTerm.map((artist) => {
              return (
                <li key={artist.id}>
                  <img
                    style={{ width: "100px", height: "100px" }}
                    src={artist.image}
                    alt=""
                  />
                  <p>{artist.name}</p>
                </li>
              );
            })}
          </ul>
        </section>
      </section>

      {/* Top Tracks */}
      <section>
        <h1>Top Tracks</h1>
        <section>
          <h3>Last 4 Weeks</h3>
          <ul
            style={{
              listStyle: "none",
              display: "flex",
              flexWrap: "wrap",
              padding: "0",
              gap: "1rem",
            }}
          >
            {user.topTracks.shortTerm.map((track) => {
              return (
                <li key={track.id}>
                  <img
                    style={{ width: "100px", height: "100px" }}
                    src={track.image}
                    alt=""
                  />
                  <p>{track.name}</p>
                  <p>{track.artistName}</p>
                </li>
              );
            })}
          </ul>
        </section>
        <section>
          <h3>Last 6 Months</h3>
          <ul
            style={{
              listStyle: "none",
              display: "flex",
              flexWrap: "wrap",
              padding: "0",
              gap: "1rem",
            }}
          >
            {user.topTracks.mediumTerm.map((track) => {
              return (
                <li key={track.id}>
                  <img
                    style={{ width: "100px", height: "100px" }}
                    src={track.image}
                    alt=""
                  />
                  <p>{track.name}</p>
                  <p>{track.artistName}</p>
                </li>
              );
            })}
          </ul>
        </section>
        <section>
          <h3>All Time</h3>
          <ul
            style={{
              listStyle: "none",
              display: "flex",
              flexWrap: "wrap",
              padding: "0",
              gap: "1rem",
            }}
          >
            {user.topTracks.mediumTerm.map((track) => {
              return (
                <li key={track.id}>
                  <img
                    style={{ width: "100px", height: "100px" }}
                    src={track.image}
                    alt=""
                  />
                  <p>{track.name}</p>
                  <p>{track.artistName}</p>
                </li>
              );
            })}
          </ul>
        </section>
      </section>
      <section id={styles.aside_content}></section>
    </div>
  );
};

export default HomePage;
