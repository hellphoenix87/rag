from fastapi import APIRouter, HTTPException
from app.api.models.rag_models import QueryRequest, IngestRequest
from app.api.dependencies import container

router = APIRouter()


@router.get("/health")
async def health_check():
    return await container.health_service.check_health()


@router.get("/qdrant-health")
async def health_check_qdrant():
    try:
        return await container.health_service.check_qdrant_health()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/collections")
async def list_collections():
    try:
        return await container.health_service.list_collections()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/ingest")
async def ingest_documents(request: IngestRequest):
    try:
        return await container.ingestion_service.ingest_documents(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/query")
async def query_documents(request: QueryRequest):
    print(f"Received query: {request.query}, top_k: {request.top_k}")
    try:
        return await container.query_service.query_documents(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
