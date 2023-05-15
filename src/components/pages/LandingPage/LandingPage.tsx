import { Link } from "react-router-dom";
import styles from "./LandingPage.module.scss";

const LandingPage = () => {
  return (
    <main id={styles.main_wrapper}>
      <section id={styles.main_content_section}>
        <section id={styles.info_content}>
          <section id={styles.info_text_container}>
            <h1>Learn more about your favorite artists.</h1>
            <p>
              Learn about your favorite music artist’s discography,
              automatically create playlists around these artists, and even view
              your Spotify stats!
            </p>
            <Link to="/home">
              <button>Login to Spotify</button>
            </Link>
          </section>
        </section>
        <section id={styles.image_content}>
          <img src="/icons/landing-page-image.jpg" alt="" />
        </section>
      </section>
      <footer>Powered by Spotify & ChatGPT</footer>
    </main>
  );
};

export default LandingPage;
