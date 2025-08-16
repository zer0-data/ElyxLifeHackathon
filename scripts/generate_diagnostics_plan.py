# --- scripts/generate_diagnostics_plan.py ---
# This script generates a structured diagnostics plan.

import json

DIAGNOSTICS_OUTPUT_PATH = "data/diagnostics_plan.json"

DIAGNOSTIC_PANEL = [
    {"test": "General Health Assessment", "owner": "Dr. Warren"},
    {"test": "Full Blood Panel (HbA1c, Lipids, etc.)", "owner": "Dr. Warren"},
    {"test": "Wearable Data Analysis (HRV, Sleep)", "owner": "Advik"},
    {"test": "Body Composition Analysis (DEXA)", "owner": "Dr. Warren"},
    {"test": "VO2 Max Testing", "owner": "Rachel"},
    {"test": "Micronutrient Panel", "owner": "Carla"}
]

QUARTERLY_PLAN = [
    {"quarter": 1, "month": 3, "description": "Baseline & progress check"},
    {"quarter": 2, "month": 6, "description": "Progress check & advanced screening"},
    {"quarter": 3, "month": 8, "description": "Final review panel"}
]

def generate_diagnostics_plan():
    plan = {
        "overall_frequency": "Quarterly (every 3 months)",
        "quarterly_panels": []
    }
    
    for quarter in QUARTERLY_PLAN:
        quarterly_plan = {
            "quarter": quarter["quarter"],
            "month": quarter["month"],
            "description": quarter["description"],
            "tests": []
        }
        
        for test in DIAGNOSTIC_PANEL:
            test_details = {
                "test_name": test["test"],
                "owner": test["owner"],
                "logistics": "Ruby" # Ruby always handles logistics
            }
            quarterly_plan["tests"].append(test_details)
        
        # Add special tests for specific quarters
        if quarter["quarter"] == 2:
            quarterly_plan["tests"].append({
                "test_name": "Coronary Calcium Score",
                "owner": "Dr. Warren",
                "logistics": "Ruby"
            })
        
        plan["quarterly_panels"].append(quarterly_plan)

    with open(DIAGNOSTICS_OUTPUT_PATH, "w") as f:
        json.dump(plan, f, indent=2)
    print(f"✅ Diagnostics plan generated at {DIAGNOSTICS_OUTPUT_PATH}")

if __name__ == "__main__":
    generate_diagnostics_plan()
