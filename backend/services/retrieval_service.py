# backend/services/retrieval_service.py

import json
from ..config import CHAT_DATA_PATH, DECISIONS_DATA_PATH, SCHEDULE_DATA_PATH, PERSONA_SUMMARIES_PATH

class RetrievalService:
    def __init__(self):
        self.chat_data = self._load_data(CHAT_DATA_PATH)
        self.decisions_data = self._load_data(DECISIONS_DATA_PATH)
        self.schedule_data = self._load_data(SCHEDULE_DATA_PATH)
        self.persona_summaries = self._load_data(PERSONA_SUMMARIES_PATH)

    def _load_data(self, path):
        try:
            with open(path, 'r') as f:
                return json.load(f)
        except (FileNotFoundError, json.JSONDecodeError) as e:
            print(f"Error loading data from {path} for retrieval: {e}")
            return []

    def retrieve_context(self, query: str, top_k: int = 5) -> str:
        """
        Simulates context retrieval from all relevant data sources.
        """
        query_lower = query.lower()
        context_parts = []

        # Search chat data
        relevant_messages = [
            m for m in self.chat_data
            if any(keyword in m.get("text", "").lower() for keyword in query_lower.split())
        ]
        context_parts.append("\n--- Chat Context ---")
        if relevant_messages:
            context_parts.append("\n".join([
                f"[{m.get('date')}] {m.get('sender')}: {m.get('text')}"
                for m in relevant_messages[:top_k]
            ]))
        else:
            context_parts.append("No relevant chat messages found.")

        # Search structured decisions
        relevant_decisions = [
            d for d in self.decisions_data
            if any(keyword in d.get("summary", "").lower() for keyword in query_lower.split())
        ]
        context_parts.append("\n--- Decision Context ---")
        if relevant_decisions:
            context_parts.append("\n".join([
                f"[{d.get('date')}] Decision: {d.get('summary')}"
                for d in relevant_decisions[:top_k]
            ]))
        else:
            context_parts.append("No relevant decisions found.")

        # Search schedules for events
        schedule_events = []
        for month, data in self.schedule_data.items():
            for day in data.get("daily_details", []):
                for event in day.get("events", []):
                    if any(keyword in event.lower() for keyword in query_lower.split()):
                        schedule_events.append(f"[{day['date']}] Event: {event}")
        context_parts.append("\n--- Schedule Context ---")
        if schedule_events:
            context_parts.append("\n".join(schedule_events[:top_k]))
        else:
            context_parts.append("No relevant schedule events found.")

        return "\n".join(context_parts)

# Instantiate the service
retrieval_service = RetrievalService()
