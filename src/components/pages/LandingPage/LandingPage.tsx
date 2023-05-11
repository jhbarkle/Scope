import { Link } from "react-router-dom";
import styles from "./LandingPage.module.scss";

const LandingPage = () => {
  return (
    <main id={styles.main_wrapper}>
      <section id={styles.content_wrapper}>
        <section className={styles.info_section}>
          <h1>Learn more about your favorite artists.</h1>
          <p>
            Learn about your favorite music artist’s discography, automatically
            create playlists around these artists, and even view your Spotify
            stats!
          </p>
          <section>
            <img src="/icons/vinyl.png" alt="" />
            <p>
              Click this icon on an Artist page to create a sample playlist
              saved to your spotify account.
            </p>
          </section>
          <Link to="/home">
            <button>Login to Spotify</button>
          </Link>
        </section>
        <section className={styles.hero_image_section}>Right</section>
      </section>

      <footer>Powered by Spotify & ChatGPT</footer>
    </main>
  );
};

export default LandingPage;
