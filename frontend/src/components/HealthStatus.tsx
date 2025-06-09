import { useState, useEffect } from "react";
import { fetchHealth } from "../api/routes/health";
import type { HealthResponse } from "../api/routes/health";
import styles from "../styles/HealthStatus.module.css";

export default function HealthStatus() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    setLoading(true);
    const start = Date.now();
    try {
      const data = await fetchHealth();
      setHealth(data);
      // Ensure spinner is visible for at least 1 second
      const elapsed = Date.now() - start;
      if (elapsed < 500) {
        await new Promise((res) => setTimeout(res, 500 - elapsed));
      }
    } catch {
      setHealth(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleCheck();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.topRight}>
      <section className={styles.statusBar}>
        <span>
          <strong>API Health:</strong>{" "}
          <span className={styles.statusValue}>
            {loading ? (
              <span className={styles.spinner} />
            ) : health && health.status === "healthy" ? (
              <span style={{ color: "#66bb6a", fontSize: "1.2em" }}>✔️</span>
            ) : (
              <span style={{ color: "#d32f2f", fontSize: "1.2em" }}>❌</span>
            )}
          </span>
        </span>
        <button
          className={styles.button}
          onClick={handleCheck}
          disabled={loading}
        >
          Check
        </button>
        {/* Remove error message display */}
        {health && health.detail && (
          <span style={{ color: "#555", marginLeft: "1.5rem" }}>
            {health.detail}
          </span>
        )}
      </section>
    </div>
  );
}
