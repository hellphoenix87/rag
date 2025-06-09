from langchain.prompts import PromptTemplate

rag_prompt_template = PromptTemplate(
    input_variables=["history", "context", "question"],
    template=(
        "Conversation so far:\n{history}\n"
        "Context:\n{context}\n\n"
        "User question: {question}\n"
        "Answer:"
    ),
)
