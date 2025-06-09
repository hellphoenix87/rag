# RAG Backend with FastAPI, Qdrant, Ollama (Mistral), and React Frontend

This project is a Retrieval Augmented Generation (RAG) stack using **FastAPI**, **Qdrant**, **Ollama** (with Mistral LLM), and a React frontend.

---

## Features

- **FastAPI** backend for RAG orchestration
- **Qdrant** vector database for document chunk retrieval
- **Ollama** running Mistral LLM locally for answer generation
- **React** frontend with conversation history
- **Docker Compose** for easy multi-service orchestration

---

## Prerequisites

- [Docker](https://www.docker.com/get-started) and Docker Compose
- (For local dev) [Ollama](https://ollama.com/download) if you want to run LLM outside Docker
- (For local dev) [Qdrant] docker pull qdrant/qdrant / docker run -p 6333:6333

---

## Quick Start (with Docker Compose)

1. **Clone the repository**

   ```bash
   git clone https://github.com/hellphoenix87/rag
   cd <your-repo>
   ```

2. **Start all services**

   ```bash
   docker-compose up --build
   ```

3. **Pull the Mistral model in the Ollama container (if not auto-pulled)**

   ```bash
   docker exec -it <ollama-container-name> ollama pull mistral
   ```

   Replace `<ollama-container-name>` with the actual name, e.g. `rag-ollama-1` (see `docker ps`).

4. **Access the services:**
   - FastAPI docs: [http://localhost:8000/docs](http://localhost:8000/docs)
   - React frontend: [http://localhost:3000](http://localhost:3000)

---

## .env Configuration

You can set environment variables in a `.env` file (used by both Docker Compose and Python):

```env
QDRANT_HOST=qdrant
QDRANT_PORT=6333
OLLAMA_BASE_URL=http://ollama:11434
```

---

## Useful Commands

Clone the repository:

```bash
git clone <your-repo-url>
cd <your-repo>
```

Start all services:

```bash
docker-compose up --build
```

Pull the Mistral model in the Ollama container:

```bash
docker exec -it rag-ollama-1 ollama pull mistral
```

Check if Mistral is available in Ollama:

```bash
docker exec -it rag-ollama-1 ollama list
```

Restart backend after pulling model:

```bash
docker-compose restart fastapi-app
```

---

## Development (without Docker)

Install Python dependencies:

```bash
pip install -r requirements.txt
pip install python-dotenv
```

Install and run Ollama locally:

```bash
ollama pull mistral
ollama serve
```

Run FastAPI backend:

```bash
uvicorn app.main:app --reload
```

Run React frontend:

```bash
cd frontend
npm install
npm start
```
