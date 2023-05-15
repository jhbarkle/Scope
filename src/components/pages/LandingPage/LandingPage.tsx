import { Link } from "react-router-dom";
import styles from "./LandingPage.module.scss";

const LandingPage = () => {
  return (
    <main id={styles.main_wrapper}>
      <section id={styles.main_content_section}>
        <section id={styles.info_content}></section>
        <section id={styles.image_content}></section>
      </section>
      <footer></footer>
    </main>
  );
};

export default LandingPage;
