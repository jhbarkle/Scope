import styles from "./LandingPage.module.scss";

const LandingPage = () => {
  return (
    <main id={styles.main_wrapper}>
      <section id={styles.content_wrapper}>
        <section className={styles.info_section}>Left</section>
        <section className={styles.hero_image_section}>Right</section>
      </section>

      <footer>Powered by Spotify & ChatGPT</footer>
    </main>
  );
};

export default LandingPage;
