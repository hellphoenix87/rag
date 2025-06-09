import { useState } from "react";
import { fetchQuery, type QueryResponse } from "../api/routes/query";
import styles from "../styles/QueryBox.module.css";

interface ConversationTurn {
  query: string;
  answer: string;
}

interface Props {
  setResponse: (r: string | null) => void;
  setError: (e: string | null) => void;
  setQuestion?: (q: string | null) => void;
  isTyping?: boolean;
  onStopContinue?: () => void;
  stopContinueLabel?: string;
  conversationHistory: ConversationTurn[];
}

export default function QueryBox({
  setResponse,
  setError,
  setQuestion,
  isTyping,
  onStopContinue,
  stopContinueLabel = "Submit",
  conversationHistory,
}: Props) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  /**
   * Extracts the response message from the API response data
   */
  const extractResponseMessage = (data: QueryResponse): string => {
    if (typeof data === "string") {
      return data;
    }

    // Priority order: llm_answer > message > stringify
    if (data.llm_answer) {
      return data.llm_answer;
    }

    if (data.message) {
      return data.message;
    }

    // Fallback to JSON string
    return JSON.stringify(data, null, 2);
  };

  /**
   * Handles form submission for new queries, stop, and continue actions
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Handle Stop action
    if (isTyping && onStopContinue) {
      console.log("🛑 Stopping typing animation");
      onStopContinue();
      return;
    }

    // Handle Continue action
    if (stopContinueLabel === "Continue" && onStopContinue) {
      console.log("▶️ Continuing typing animation");
      onStopContinue();
      return;
    }

    // Handle new query submission
    if (!query.trim()) {
      console.warn("⚠️ Empty query submission attempted");
      return;
    }

    await submitNewQuery();
  };

  /**
   * Submits a new query to the API
   */
  const submitNewQuery = async () => {
    console.log("📤 Submitting new query:", query);
    console.log("📤 Conversation history length:", conversationHistory.length);

    // Debug conversation history structure
    if (conversationHistory.length > 0) {
      console.log(
        "📤 History structure:",
        conversationHistory.map((turn, index) => ({
          index,
          hasQuery: "query" in turn,
          hasQuestion: "question" in turn,
          keys: Object.keys(turn),
          queryValue: turn.query,
          answerLength: turn.answer?.length || 0,
        }))
      );
    }

    setLoading(true);
    setError(null);
    setResponse(null);

    // Set the current question for display
    if (setQuestion) {
      setQuestion(query);
    }

    try {
      const data = await fetchQuery(query, conversationHistory);

      console.log("✅ Query successful, processing response");

      const responseMessage = extractResponseMessage(data);
      setResponse(responseMessage);

      // Clear the input field after successful submission
      setQuery("");

      console.log("✅ Response set successfully");
    } catch (err: any) {
      console.error("❌ Query failed:", err);

      // Enhanced error handling
      let errorMessage = "Unknown error occurred";

      if (err.message) {
        errorMessage = err.message;
      } else if (typeof err === "string") {
        errorMessage = err;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Determines the appropriate CSS class for the button based on its current state
   */
  const getButtonClass = (): string => {
    const baseClass = styles.button;

    if (stopContinueLabel === "Stop") {
      return `${baseClass} ${styles.buttonStop}`;
    }

    if (stopContinueLabel === "Continue") {
      return `${baseClass} ${styles.buttonContinue}`;
    }

    return `${baseClass} ${styles.buttonSubmit}`;
  };

  /**
   * Determines if the submit button should be disabled
   */
  const isButtonDisabled = (): boolean => {
    if (loading) {
      return true;
    }

    // For Submit button, require non-empty query
    if (stopContinueLabel === "Submit" && !query.trim()) {
      return true;
    }

    // For Stop/Continue buttons, never disable (they should always be clickable)
    return false;
  };

  /**
   * Handles input changes with validation
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setQuery(newValue);

    // Clear any existing errors when user starts typing
    if (newValue.trim() && setError) {
      setError(null);
    }
  };

  return (
    <form className={styles.queryBox} onSubmit={handleSubmit}>
      <label className={styles.label}>
        Ask a question:
        <input
          className={styles.input}
          type="text"
          value={query}
          onChange={handleInputChange}
          disabled={loading || isTyping}
          placeholder="Type your question here..."
          maxLength={500} // Reasonable limit for queries
        />
      </label>

      <button
        className={getButtonClass()}
        type="submit"
        disabled={isButtonDisabled()}
        aria-label={`${stopContinueLabel} button`}
      >
        {loading ? (
          <span className={styles.spinner} aria-label="Loading" />
        ) : (
          stopContinueLabel
        )}
      </button>
    </form>
  );
}
