from fastapi import FastAPI
from app.api.routes.rag_routes import router as rag_router
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

# from .api.routes.rag_routes import router as rag_router

app = FastAPI()


# Define CORS origins
origins = [
    "http://localhost:3000",  # React app
    "http://localhost:8000",  # FastAPI app
    "http://localhost:5173",  # Vite app
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(rag_router, prefix="/api")
