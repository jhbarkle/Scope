import styles from "./Navbar.module.scss";

const Navbar = () => {
  return (
    <nav id={styles.nav_items}>
      <img src="/icons/sound-waves.png" alt="" />
      <a href="">creat.or</a>
    </nav>
  );
};

export default Navbar;
