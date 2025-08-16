# --- scripts/compute_internal_metrics.py ---
# This script computes internal metrics like workload per team member.

import json
import pandas as pd
from collections import defaultdict

CHAT_DATA_PATH = "data/chat_data.json"
METRICS_OUTPUT_PATH = "data/internal_metrics.json"

def compute_metrics():
    try:
        with open(CHAT_DATA_PATH) as f:
            chat_data = json.load(f)
    except FileNotFoundError:
        print(f"Error: {CHAT_DATA_PATH} not found. Please run generate_chats.py first.")
        return

    df = pd.DataFrame(chat_data)
    
    role_metrics = defaultdict(lambda: {"messages_count": 0, "members_served": set()})
    
    for index, row in df.iterrows():
        role = row["role"]
        sender = row["sender"]
        if role != "Member":
            role_metrics[role]["messages_count"] += 1
            # Assuming the previous message was from the member
            if index > 0 and df.iloc[index-1]["role"] == "Member":
                role_metrics[role]["members_served"].add(df.iloc[index-1]["sender"])

    final_metrics = {
        "total_messages": len(df),
        "messages_by_role": {role: metrics["messages_count"] for role, metrics in role_metrics.items()},
        "members_served_by_role": {role: len(metrics["members_served"]) for role, metrics in role_metrics.items()}
    }

    with open(METRICS_OUTPUT_PATH, "w") as f:
        json.dump(final_metrics, f, indent=2)
    print(f"✅ Internal metrics computed and saved to {METRICS_OUTPUT_PATH}")

if __name__ == "__main__":
    compute_metrics()
