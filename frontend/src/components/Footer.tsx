import styles from "../styles/Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      &copy; {new Date().getFullYear()} RAG &mdash; hellphoenix87
    </footer>
  );
}
