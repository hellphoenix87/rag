import styles from "../styles/Response.module.css";

interface Props {
  question: string | null;
  displayed: string;
  error: string | null;
}

export default function ResponseContent({ question, displayed, error }: Props) {
  return (
    <>
      <div className={styles.header}>{error ? "Error" : "Response:"}</div>
      {question && (
        <div className={styles.userMessage}>
          <span className={styles.userLabel}>You:</span> {question}
        </div>
      )}
      <div className={error ? styles.errorContent : styles.responseContent}>
        {error ? (
          <span>{error}</span>
        ) : displayed ? (
          <>
            <span>{displayed}</span>
            <span className={styles.cursor}>|</span>
          </>
        ) : (
          <span style={{ color: "#b0bec5" }}>Generating response</span>
        )}
      </div>
    </>
  );
}
