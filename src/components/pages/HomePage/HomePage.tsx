import { useEffect, useState } from "react";
import styles from "./HomePage.module.scss";
import { authorizeAndGatherUserData } from "../../../services/spotify/spotify_auth";
import { fetchProfile } from "../../../services/spotify/spotify";
import { UserProfile } from "../../../models/Profile";
import { useNavigate } from "react-router-dom";
import GenericError from "../../molecules/GenericError";

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [user, setUser] = useState<UserProfile>();

  useEffect(() => {
    const fetchProfileData = async () => {
      await authorizeAndGatherUserData();

      console.log("Fetching profile data...");
      await fetchProfile()
        .then((profile) => {
          console.log("==========Success==========", profile);
          setUser(profile),
            () => {
              console.log("Finished fetching profile data.");
              console.log(
                "Here is the currnet user State for the Homepage: ",
                user
              );
            };
        })
        .catch((error) => {
          console.log("==========Error==========", error);
          setIsError(true);
        });

      setIsLoading(false);
    };

    fetchProfileData();
  }, []);

  if (isError) {
    return <GenericError setIsError={setIsError} />;
  }

  return isLoading ? (
    <div id={styles.loading}>
      <img src="/loading.gif" alt="Loading" />
    </div>
  ) : (
    <div id={styles.home_wrapper}>
      <section id={styles.main_content}>
        <h1>Hi, {user?.display_name}</h1>
        <ul>
          <li>Email: {user?.email}</li>
          <li>Follower Count: {user?.followers}</li>
          <li>Spotify ID: {user?.id}</li>
          <li>Spotify URI: {user?.uri}</li>
          <li>
            <img src={user?.profileImage} alt="" />
          </li>
        </ul>
      </section>
      <section id={styles.aside_content}></section>
    </div>
  );
};

export default HomePage;
