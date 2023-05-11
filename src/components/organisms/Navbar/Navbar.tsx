import styles from "./Navbar.module.scss";

const Navbar = () => {
  return (
    <nav id={styles.nav_items}>
      <img src="/icons/vinyl.png" alt="" />
      <a href="">Scope.</a>
    </nav>
  );
};

export default Navbar;
