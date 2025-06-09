from sentence_transformers import SentenceTransformer

# Load the model once at module level
model = SentenceTransformer("all-MiniLM-L6-v2")


def embed_text(text: str) -> list[float]:
    """
    Embed text using SentenceTransformers.
    """
    embedding = model.encode(text)
    return embedding.tolist()
