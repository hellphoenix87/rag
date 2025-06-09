from qdrant_client import QdrantClient
from qdrant_client.http import models as qmodels
import asyncio


class QdrantRepository:
    def __init__(self, client: QdrantClient):
        self.client = client

    async def store_documents(self, documents, collection_name, vectors, payloads):
        """
        Store documents (chunks) in Qdrant vector database.
        """
        # Ensure collection exists (create if not)
        await asyncio.to_thread(
            self.client.recreate_collection,
            collection_name=collection_name,
            vectors_config=qmodels.VectorParams(
                size=len(vectors[0]), distance="Cosine"
            ),
        )

        # Prepare points
        points = [
            qmodels.PointStruct(id=i, vector=vector, payload=payload)
            for i, (vector, payload) in enumerate(zip(vectors, payloads))
        ]

        # Upsert points
        await asyncio.to_thread(
            self.client.upsert, collection_name=collection_name, points=points
        )

        return {"stored": len(documents)}

    async def search_documents(self, query_vector, collection_name, limit):
        """
        Search for similar documents in Qdrant.
        """
        hits = await asyncio.to_thread(
            self.client.search,
            collection_name=collection_name,
            query_vector=query_vector,
            limit=limit,
            with_payload=True,
        )
        return hits

    async def get_collections(self):
        """
        Get all collections from Qdrant.
        """
        return await asyncio.to_thread(self.client.get_collections)

    async def get_cluster_info(self):
        """
        Get cluster information from Qdrant.
        """
        return await asyncio.to_thread(self.client.get_cluster_info)
