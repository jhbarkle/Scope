import { UserProfile } from "../../../models/UserProfile";
import { Category } from "../../../types";

import styles from "./Profile.module.scss";

interface ProfileProps {
  profile: UserProfile;
  setCategory: (category: Category) => void;
  category: string;
}

const Profile: React.FC<ProfileProps> = ({
  profile,
  setCategory,
  category,
}) => {
  const followersString =
    profile.followers !== 1
      ? `${profile.followers} followers`
      : `${profile.followers} follower`;

  const getActiveButton = (state: Category) => {
    if (state === category) {
      return styles.active;
    } else {
      return styles.inactive;
    }
  };

  return (
    <div id={styles.profile_container}>
      <section id={styles.profile_image_container}>
        <a href={profile.spotifyProfileUrl}>
          <img
            id={styles.profile_image}
            src={
              profile.profileImage.length > 0
                ? profile.profileImage
                : "/icons/default-profile-image.png"
            }
            alt="profile-image"
          />
        </a>
      </section>
      <section id={styles.profile_info}>
        <h1>Hi, {profile.displayName}</h1>
        <p>{followersString}</p>
      </section>
      <section id={styles.button_container}>
        <button
          className={getActiveButton("You")}
          id={styles.button_style}
          onClick={() => setCategory("You")}
        >
          You
        </button>
        <button
          className={getActiveButton("Discover")}
          id={styles.button_style}
          onClick={() => setCategory("Discover")}
        >
          Discover
        </button>
        <button
          className={getActiveButton("Search")}
          id={styles.button_style}
          onClick={() => setCategory("Search")}
        >
          Search
        </button>
        <button
          className={getActiveButton("Genres")}
          id={styles.button_style}
          onClick={() => setCategory("Genres")}
        >
          Genres
        </button>
      </section>
    </div>
  );
};
export default Profile;
