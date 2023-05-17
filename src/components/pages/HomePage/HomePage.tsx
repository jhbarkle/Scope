import { useEffect, useState } from "react";
import styles from "./HomePage.module.scss";
import { fetchProfile } from "../../../services/spotify";
import { UserProfile } from "../../../models/Profile";
import { makeAPIRequest } from "../../../services";
import { authorizeAndGatherUserData } from "../../../services/spotify_auth";

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(true);
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
