import { UserProfile } from "../../../models/UserProfile";
import styles from "./Profile.module.scss";

interface ProfileProps {
  profile: UserProfile;
}

const Profile: React.FC<ProfileProps> = ({ profile }) => {
  const followersString =
    profile.followers > 1
      ? `${profile.followers} followers`
      : `${profile.followers} follower`;

  return (
    <div id={styles.profile_container}>
      <section id={styles.profile_image_container}>
        <a href={profile.spotifyProfileUrl}>
          <img
            id={styles.profile_image}
            src={profile.profileImage}
            alt="profile-image"
          />
        </a>
      </section>
      <section id={styles.profile_info}>
        <h1>Hi, {profile.displayName}</h1>
        <p>{followersString}</p>
        <h4>Check out some of your Spotify stats!</h4>
      </section>
    </div>
  );
};
export default Profile;
