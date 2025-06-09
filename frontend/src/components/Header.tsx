import styles from '../styles/Header.module.css';
import HealthStatus from './HealthStatus';

export default function Header() {
  return (
    <header className={styles.header}>
      <span>RAG - Retrieval-Augmented Generation</span>
      <div className={styles.healthWrapper}>
        <HealthStatus />
      </div>
    </header>
  );
}