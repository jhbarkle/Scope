import { useEffect, useState } from "react";
import styles from "./HomePage.module.scss";
import { login } from "../../../services/spotify";

const HomePage = () => {
  const [displayName, setDisplayName] = useState(
    localStorage.getItem("display_name") ?? "User"
  );

  useEffect(() => {
    const fetchProfileData = async () => {
      if (
        localStorage.getItem("display_name") === undefined ||
        localStorage.getItem("display_name") === null
      ) {
        console.log("Grabbing User Profile");
        await login();
      } else {
        console.log("Already Logged In");
        return;
      }

      const displayName = localStorage.getItem("display_name");
      setDisplayName(displayName ?? "Anon");
    };

    fetchProfileData();
  }, []);

  return displayName === "User" ? (
    <div>
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
