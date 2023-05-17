import { useEffect, useState } from "react";
import styles from "./HomePage.module.scss";
import { authorizeAndGatherUserData } from "../../../services/spotify";

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      await authorizeAndGatherUserData();
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
