import { useState, useRef, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import QueryBox from "./components/QueryBox";
import Response from "./components/Response";

// Add conversation types
interface ConversationTurn {
  query: string;
  answer: string;
}

export default function App() {
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [question, setQuestion] = useState<string | null>(null);
  const [displayed, setDisplayed] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [stoppedAt, setStoppedAt] = useState<number | null>(null);

  // Add conversation history state
  const [conversationHistory, setConversationHistory] = useState<
    ConversationTurn[]
  >([]);

  const intervalRef = useRef<number | null>(null);
  const responseRef = useRef<string | null>(null);
  const displayedRef = useRef<string>("");
  const stoppedAtRef = useRef<number | null>(null);
  const prevResponseRef = useRef<string | null>(null);

  // Sync refs with state
  useEffect(() => {
    responseRef.current = response;
  }, [response]);
  useEffect(() => {
    displayedRef.current = displayed;
  }, [displayed]);

  const startTyping = (startIdx = 0) => {
    if (!response) return;
    setIsTyping(true);
    let i = startIdx;

    console.log("startTyping from", i);

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = window.setInterval(() => {
      setDisplayed(response.slice(0, i + 1));
      i++;
      if (i >= response.length && intervalRef.current) {
        clearInterval(intervalRef.current);
        setIsTyping(false);
        setStoppedAt(null);
        stoppedAtRef.current = null;

        // FIX: Store the conversation turn correctly
        if (question && response) {
          console.log("📝 Adding to conversation history:", {
            query: question,
            answer: response,
          });
          setConversationHistory((prev) => [
            ...prev,
            { query: question, answer: response }, // ✅ Correct: using 'query' field
          ]);
        }
      }
    }, 18);
  };

  useEffect(() => {
    if (!response) {
      setDisplayed("");
      setIsTyping(false);
      setStoppedAt(null);
      stoppedAtRef.current = null;
      prevResponseRef.current = null;
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    // Only handle NEW responses, not resume
    if (prevResponseRef.current !== response) {
      prevResponseRef.current = response;
      if (intervalRef.current) clearInterval(intervalRef.current);

      setDisplayed("");
      setStoppedAt(null);
      stoppedAtRef.current = null;

      setTimeout(() => startTyping(0), 10);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [response, question]);

  const handleStopContinue = () => {
    const currentDisplayedLength = displayedRef.current.length;

    if (isTyping) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setIsTyping(false);
      setStoppedAt(currentDisplayedLength);
      stoppedAtRef.current = currentDisplayedLength;
      console.log("STOPPED at", {
        isTyping: false,
        stoppedAt: currentDisplayedLength,
        displayed: displayedRef.current,
        refValue: stoppedAtRef.current,
      });
    } else {
      const resumeFromIndex = stoppedAtRef.current || 0;
      console.log("DEBUG Continue:", {
        resumeFromIndex,
        refValue: stoppedAtRef.current,
        responseLength: response?.length,
      });
      if (
        response &&
        resumeFromIndex > 0 &&
        resumeFromIndex < response.length
      ) {
        console.log("RESUME from", resumeFromIndex);
        startTyping(resumeFromIndex);
      }
    }
  };

  // Add function to clear conversation
  const clearConversation = () => {
    setConversationHistory([]);
    setResponse(null);
    setError(null);
    setQuestion(null);
    setDisplayed("");
    setIsTyping(false);
    setStoppedAt(null);
    stoppedAtRef.current = null;
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  return (
    <div className="app-wrapper">
      <Header />
      <main className="main-content">
        <Response
          question={question}
          error={error}
          displayed={displayed}
          conversationHistory={conversationHistory}
          onClearConversation={clearConversation}
        />
        <QueryBox
          setResponse={setResponse}
          setError={setError}
          setQuestion={setQuestion}
          isTyping={isTyping}
          onStopContinue={handleStopContinue}
          stopContinueLabel={
            isTyping ? "Stop" : stoppedAt !== null ? "Continue" : "Submit"
          }
          conversationHistory={conversationHistory}
        />
      </main>
      <Footer />
    </div>
  );
}
