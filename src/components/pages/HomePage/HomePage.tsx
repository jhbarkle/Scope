import { useEffect, useState } from "react";
import styles from "./HomePage.module.scss";
import { authorizeAndGatherUserData } from "../../../services/spotify/spotify_auth";
import { fetchProfile } from "../../../services/spotify/spotify";
import { UserProfile } from "../../../models/Profile";

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

  if (isError) return <div>There was an error.</div>;

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
