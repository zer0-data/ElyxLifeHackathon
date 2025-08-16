# --- scripts/extract_interventions.py ---
# This script extracts structured interventions from the chat data.

import json
import re

CHAT_DATA_PATH = "data/chat_data.json"
DECISIONS_OUTPUT_PATH = "data/decisions.json"

def extract_decisions(chat_data):
    decisions = []
    
    keywords = {
        "nutrition": ["diet", "meal plan", "food log", "carb", "supplement"],
        "exercise": ["workout", "training", "mobility", "reps", "exercise"],
        "medical": ["medication", "blood pressure", "lab results", "panel"],
        "lifestyle": ["sleep", "stress", "travel", "routine"]
    }
    
    for message in chat_data:
        text = message["text"].lower()
        
        # Simple rule-based extraction
        for category, kws in keywords.items():
            if any(kw in text for kw in kws):
                decisions.append({
                    "date": message["date"],
                    "member_name": message["sender"] if message["role"] == "Member" else "Elyx Team",
                    "category": category,
                    "summary": message["text"],
                    "origin_chat_id": f"{message['sender']}_{message['date']}", # A simple ID
                    "rationale": f"Based on conversation about {', '.join(kws)}"
                })
                break # Extract only one decision per message for simplicity

    with open(DECISIONS_OUTPUT_PATH, "w") as f:
        json.dump(decisions, f, indent=2)
    print(f"✅ Interventions/decisions extracted at {DECISIONS_OUTPUT_PATH}")

if __name__ == "__main__":
    try:
        with open(CHAT_DATA_PATH) as f:
            chat_data = json.load(f)
        extract_decisions(chat_data)
    except FileNotFoundError:
        print(f"Error: {CHAT_DATA_PATH} not found. Run generate_chats.py first.")
