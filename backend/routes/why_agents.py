# backend/routes/why_agent.py

from fastapi import APIRouter, Query
from ..services.llm_service import llm_service
from ..services.retrieval_service import retrieval_service

router = APIRouter()

@router.get("/why-agent")
def get_why_reasoning(query: str = Query(..., description="The user's question about a decision.")):
    """
    Acts as a 'Why-Agent' to provide reasoning for a decision.
    It retrieves relevant chat context and uses an LLM to generate an explanation.
    """
    # 1. Retrieve relevant context from chat logs
    context = retrieval_service.retrieve_context(query)
    
    # 2. Use the LLM to generate reasoning based on the query and context
    reasoning = llm_service.get_reasoning(query, context)
    
    return {
        "query": query,
        "reasoning": reasoning,
        "context_found": context
    }
