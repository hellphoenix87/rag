import os
from app.api.repository.qdrant import QdrantRepository
from app.api.utils.embeddings import embed_text
from app.api.utils.chunk_text import chunk_text


class IngestionService:
    def __init__(self, qdrant_repository: QdrantRepository):
        self.repository = qdrant_repository

    async def ingest_documents(self):
        """
        Loads, chunks, embeds, and stores Deutsche Telekom press releases from data dir in Qdrant.
        """

        data_dir = os.path.join(os.path.dirname(__file__), "data")
        all_chunks = []
        payloads = []

        for filename in sorted(
            os.listdir(data_dir), key=lambda x: int(x.split(".")[0])
        ):
            if filename.endswith(".txt"):
                with open(os.path.join(data_dir, filename), "r", encoding="utf-8") as f:
                    content = f.read().strip()
                    if content:
                        chunks = chunk_text(content)
                        for chunk_idx, chunk in enumerate(chunks):
                            all_chunks.append(chunk)
                            payloads.append(
                                {
                                    "text": chunk,
                                    "document_id": filename,
                                    "chunk_index": chunk_idx,
                                }
                            )

        collection_name = "press_releases"
        vectors = [embed_text(chunk) for chunk in all_chunks]

        await self.repository.store_documents(
            documents=all_chunks,
            collection_name=collection_name,
            vectors=vectors,
            payloads=payloads,
        )

        return {
            "message": f"Successfully ingested {len(all_chunks)} chunks from {len(set([p['document_id'] for p in payloads]))} documents",
            "collection": collection_name,
            "documents_count": len(set([p["document_id"] for p in payloads])),
        }
