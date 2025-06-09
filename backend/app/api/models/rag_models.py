from typing import Optional
from pydantic import BaseModel


class ConversationTurn(BaseModel):
    query: str
    answer: str


class QueryRequest(BaseModel):
    query: str
    top_k: int = 3
    conversation_history: Optional[list[ConversationTurn]] = []


class IngestRequest(BaseModel):
    documents: list[str]
    collection_name: str = "press_releases"
