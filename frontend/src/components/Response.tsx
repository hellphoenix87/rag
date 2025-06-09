import ResponseContent from "./ResponseContent";
import styles from "../styles/Response.module.css";

interface ConversationTurn {
  query: string;
  answer: string;
}

interface Props {
  question: string | null;
  error: string | null;
  displayed: string;
  conversationHistory: ConversationTurn[];
  onClearConversation: () => void;
}

export default function Response({
  question,
  error,
  displayed,
  conversationHistory,
  onClearConversation,
}: Props) {
  return (
    <div className={styles.response}>
      {/* Show conversation history */}
      {conversationHistory.length > 0 && (
        <div className={styles.conversationHistory}>
          <div className={styles.historyHeader}>
            <span>Conversation History</span>
            <button
              className={styles.clearButton}
              onClick={onClearConversation}
            >
              Clear
            </button>
          </div>
          {conversationHistory.map((turn, index) => (
            <div key={index} className={styles.historyTurn}>
              <div className={styles.historyQuestion}>
                <span className={styles.userLabel}>You:</span> {turn.query}
              </div>
              <div className={styles.historyAnswer}>
                <span className={styles.assistantLabel}>Assistant:</span>{" "}
                {turn.answer}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Current conversation */}
      <ResponseContent
        question={question}
        error={error}
        displayed={displayed}
      />
    </div>
  );
}
