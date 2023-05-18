import { useEffect, useState } from "react";
import styles from "./HomePage.module.scss";
import { makeAPIRequest } from "../../../services/spotify";
import { authorizeAndGatherUserData } from "../../../services/spotify/spotify_auth";
import { fetchProfile } from "../../../services/spotify/spotify";

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  // States Needed:
  // 1. User's Profile Data
  // 2. Search State
  // 3. Page State (Discography Search, Your Stats)

  useEffect(() => {
    const fetchProfileData = async () => {
      await authorizeAndGatherUserData();
      await makeAPIRequest(fetchProfile);
      setIsLoading(false);
    };

    fetchProfileData();
  }, []);

  return isLoading ? (
    <div id={styles.loading}>
      <img src="/loading.gif" alt="Loading" />
    </div>
  ) : (
    <div id={styles.home_wrapper}>
      <section id={styles.main_content}></section>
      <section id={styles.aside_content}></section>
    </div>
  );
};

export default HomePage;
