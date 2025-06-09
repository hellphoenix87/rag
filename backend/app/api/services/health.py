from app.api.repository.qdrant import QdrantRepository


class HealthService:
    def __init__(self, qdrant_repository: QdrantRepository):
        self.repository = qdrant_repository

    async def check_health(self):
        """
        Basic health check for the API.
        """
        return {
            "status": "healthy",
            "service": "RAG API",
            "message": "Service is running",
        }

    async def check_qdrant_health(self):
        """
        Check if Qdrant is accessible and healthy.
        """
        try:
            # Use get_collections as a basic health check
            await self.repository.get_collections()
            return {
                "status": "healthy",
                "service": "Qdrant",
                "message": "Qdrant is reachable",
            }
        except Exception as e:
            return {"status": "unhealthy", "service": "Qdrant", "error": str(e)}

    async def list_collections(self):
        """
        List all collections in Qdrant.
        """
        try:
            collections = await self.repository.get_collections()
            return {
                "status": "success",
                "collections": collections.collections,
                "count": len(collections.collections),
            }
        except Exception as e:
            return {"status": "error", "error": str(e)}
