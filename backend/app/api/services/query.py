from app.api.repository.qdrant import QdrantRepository
from app.api.services.ingestion import IngestionService
from app.api.utils.embeddings import embed_text
from app.api.utils.llm import call_ollama
from app.api.utils.prompt_templates import rag_prompt_template


class QueryService:
    def __init__(
        self, qdrant_repository: QdrantRepository, ingestion_service: IngestionService
    ):
        self.repository = qdrant_repository
        self.ingestion_service = ingestion_service

    async def query_documents(self, request):
        """
        Handles a user query: retrieves relevant chunks, builds prompt with history/context,
        and generates an answer using the local LLM (Ollama/Mistral).
        """
        collection_name = "press_releases"
        collections_response = await self.repository.get_collections()
        collection_names = [col.name for col in collections_response.collections]
        if collection_name not in collection_names:
            print("No data found, triggering ingestion.")
            await self.ingestion_service.ingest_documents()

        # Embed the user's query
        query_vector = embed_text(request.query)

        # Search Qdrant for similar chunks
        hits = await self.repository.search_documents(
            query_vector=query_vector,
            collection_name=collection_name,
            limit=request.top_k,
        )

        # Prepare conversation history for LLM
        history_text = ""
        if request.conversation_history:
            for turn in request.conversation_history:
                history_text += f"User: {turn.query}\nAssistant: {turn.answer}\n"

        # Prepare context for LLM
        context = "\n\n".join(
            [hit.payload["text"] for hit in hits if "text" in hit.payload]
        )
        prompt = rag_prompt_template.format(
            history=history_text,
            context=context,
            question=request.query,
        )

        # Call Ollama LLM (Mistral)
        llm_answer = call_ollama(prompt, model="mistral")

        # Optionally, return both the answer and the retrieved chunks
        results = [
            {
                "score": hit.score,
                "payload": hit.payload,
            }
            for hit in hits
        ]

        return {
            "llm_answer": llm_answer,
            "results": results,
        }
