export interface QueryResult {
  score: number;
  payload: {
    text: string;
    document_id: string;
    chunk_index: number;
  };
}

export interface QueryResponse {
  llm_answer: string;
  results: QueryResult[];
  message?: string; // Keep this for backward compatibility
}

interface ConversationTurn {
  query: string;
  answer: string;
}

const API_URL = import.meta.env.VITE_API_URL;

export async function fetchQuery(
  query: string, 
  conversationHistory: ConversationTurn[] = []
): Promise<QueryResponse> {
  const requestBody = {
    query: query,
    top_k: 10,
    conversation_history: conversationHistory,
  };

  console.log('🔍 Request body:', JSON.stringify(requestBody, null, 2));

  const response = await fetch(`${API_URL}/api/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('🔍 Error response:', errorText);
    throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
  }
  
  const result = await response.json();
  console.log('🔍 Response data:', result);
  
  return result;
}