from app.db.qdrant_client import qdrant_client
from app.api.repository.qdrant import QdrantRepository
from app.api.services.health import HealthService
from app.api.services.ingestion import IngestionService
from app.api.services.query import QueryService


class DependencyContainer:
    def __init__(self):
        self.qdrant_repository = QdrantRepository(qdrant_client)
        self.ingestion_service = IngestionService(self.qdrant_repository)
        self.health_service = HealthService(self.qdrant_repository)
        self.query_service = QueryService(
            self.qdrant_repository, self.ingestion_service
        )


# Global container instance
container = DependencyContainer()
