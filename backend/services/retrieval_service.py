# backend/services/retrieval_service.py

import json
from ..config import CHAT_DATA_PATH

class RetrievalService:
    def __init__(self):
        self.chat_data = self._load_data()

    def _load_data(self):
        try:
            with open(CHAT_DATA_PATH, 'r') as f:
                return json.load(f)
        except (FileNotFoundError, json.JSONDecodeError) as e:
            print(f"Error loading chat data for retrieval: {e}")
            return []

    def retrieve_context(self, query: str, top_k: int = 5) -> str:
        """
        Simulates context retrieval from chat logs.
        In a real app, this would use vector search (e.g., FAISS, Chroma).
        Here, we use a simple keyword search for demonstration.
        """
        query_keywords = set(query.lower().split())
        
        relevant_messages = []
        for message in self.chat_data:
            message_text = message.get("text", "").lower()
            if any(kw in message_text for kw in query_keywords):
                relevant_messages.append(message)
        
        # Sort by relevance (simple count of matching keywords)
        relevant_messages.sort(key=lambda m: sum(1 for kw in query_keywords if kw in m.get("text", "").lower()), reverse=True)
        
        # Format the top messages into a string context
        context_str = "\n".join([
            f"[{m.get('date')}] {m.get('sender')}: {m.get('text')}"
            for m in relevant_messages[:top_k]
        ])
        
        if not context_str:
            return "No relevant context found in chat logs."
            
        return context_str

# Instantiate the service
retrieval_service = RetrievalService()
