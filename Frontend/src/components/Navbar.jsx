import styles from './styles/Navbar.module.css';

const Navbar = () => {
  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        <div className={styles.logo}>GITGAINS</div>
        <div className={styles.actions}>
          <a href="#" className={styles.link}>Home</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
