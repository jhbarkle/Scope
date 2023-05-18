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
import GenericError from "../../molecules/GenericError";
import { initialUserProfile } from "./HomePage.helpers";

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [user, setUser] = useState<UserProfile>(initialUserProfile);
  const errorDebugLogString = "❌==========Error==========❌";

  useEffect(() => {
    const fetchUsersSpotifyData = async (profile: UserProfile) => {
      // Fetch User's Followed Artists, Top Artists, and Top Tracks from Spotify
      try {
        const [
          followedArtists,
          shortRangeTopArtists,
          mediumRangeTopArtists,
          longRangeTopArists,
          shortRangeTopTracks,
          mediumRangeTopTracks,
          longRangeTopTracks,
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
            shortTerm: shortRangeTopArtists,
            mediumTerm: mediumRangeTopArtists,
            longTerm: longRangeTopArists,
          },
          topTracks: {
            shortTerm: shortRangeTopTracks,
            mediumTerm: mediumRangeTopTracks,
            longTerm: longRangeTopTracks,
          },
        };
        setUser(newUser);
        console.log(
          " ✅ Successfully Updated User's Top Artists/Tracks and Followed Artist",
          user
        );
      } catch (error) {
        console.log(errorDebugLogString, error);
        setIsError(true);
      }
    };

    const fetchProfileData = async () => {
      // Authorize User
      await authorizeAndGatherUserData();

      // Fetch User's Profile
      console.log("Fetching profile data...");
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
      <section id={styles.main_content}>
        <h1>Hi, {user.display_name}</h1>
        <ul>
          <li>Email: {user.email}</li>
          <li>Follower Count: {user.followers}</li>
          <li>Spotify ID: {user.id}</li>
          <li>Spotify URI: {user.uri}</li>
          <li>
            <img src={user.profileImage} alt="" />
          </li>
        </ul>
      </section>
      {/* Followed Artists */}
      <section>
        <h1>Followed Artists</h1>
        <ul
          style={{
            listStyle: "none",
            display: "flex",
            flexWrap: "wrap",
            padding: "0",
            gap: "1rem",
          }}
        >
          {user.followedArtists.map((artist) => {
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
      <section id={styles.aside_content}></section>
    </div>
  );
};

export default HomePage;
