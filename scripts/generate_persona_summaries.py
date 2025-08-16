# --- scripts/generate_persona_summaries.py ---
# This script generates monthly summaries for each member's journey.

import json
import datetime
import pandas as pd

CHAT_DATA_PATH = "data/chat_data.json"
SUMMARIES_OUTPUT_PATH = "data/persona_summaries.json"

def generate_summaries():
    try:
        with open(CHAT_DATA_PATH) as f:
            chat_data = json.load(f)
    except FileNotFoundError:
        print(f"Error: {CHAT_DATA_PATH} not found. Please run generate_chats.py first.")
        return

    df = pd.DataFrame(chat_data)
    df["date"] = pd.to_datetime(df["date"])
    df["month"] = df["date"].dt.month
    
    members = df["sender"].unique()
    summaries = []

    for member_name in [m for m in members if m not in ["Ruby", "Dr. Warren", "Advik", "Carla", "Rachel", "Neel"]]:
        member_df = df[df["sender"] == member_name]
        
        for month in member_df["month"].unique():
            month_df = member_df[member_df["month"] == month]
            num_queries = len(month_df)
            
            # Simple summarization based on keywords in the texts
            topics = {
                "health_concerns": "health", "exercise_questions": "workout",
                "diet_concerns": "nutrition", "wearable_data": "data", "travel_issues": "travel"
            }
            summary_topics = {topic: 0 for topic in topics}
            for text in month_df["text"]:
                if isinstance(text, str):
                    for key, val in topics.items():
                        if val in text.lower():
                            summary_topics[key] += 1
            
            summary = {
                "member_name": member_name,
                "month": month,
                "total_messages_sent": num_queries,
                "summary_topics": summary_topics,
                "status_message": f"Engaged with {num_queries} queries this month. Top topics: " +
                                  ', '.join([k for k, v in sorted(summary_topics.items(), key=lambda item: item[1], reverse=True) if v > 0])
            }
            summaries.append(summary)

    with open(SUMMARIES_OUTPUT_PATH, "w") as f:
        json.dump(summaries, f, indent=2)
    print(f"✅ Persona summaries generated at {SUMMARIES_OUTPUT_PATH}")

if __name__ == "__main__":
    generate_summaries()
