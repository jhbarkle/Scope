import { useEffect, useState } from "react";
import styles from "./HomePage.module.scss";
import { login } from "../../../services/provider";

const HomePage = () => {
  // const [profile, setProfile] = useState();

  // useEffect(() => {
  //   const fetch = async () => {
  //     const accessToken = await getAccessToken(CLIENT_ID, code!);
  //     const profile = await fetchProfile(accessToken);
  //     console.log("profile", profile);
  //     setProfile(profile);
  //     // populateUI(profile);
  //   };

  //   fetch();
  // }, []);

  useEffect(() => {
    login();
  }, []);

  return (
    <div id={styles.home_wrapper}>
      <h1>Home</h1>
    </div>
  );
};

export default HomePage;
