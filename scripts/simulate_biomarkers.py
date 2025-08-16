# --- scripts/simulate_biomarkers.py ---
# This script generates synthetic biomarkers and wearable data.

import pandas as pd
import random
import os
import datetime

BIOMARKERS_OUTPUT_PATH = "data/biomarkers.csv"
WEARABLES_OUTPUT_PATH = "data/wearables.csv"

def generate_biomarkers(members):
    biomarkers = []
    start_date = datetime.date(2025, 8, 1)
    
    for member in members:
        for month in [3, 6, 8]:
            test_date = start_date + datetime.timedelta(days=(month-1)*30)
            
            # Simulate a positive trend for prediabetes/hypertension
            hba1c = random.uniform(6.0, 5.7) - (month/8) * 0.1 # Decreasing trend
            bp_systolic = random.uniform(135, 128) - (month/8) * 1.5 # Decreasing trend
            apob = random.uniform(95, 80) - (month/8) * 2
            
            biomarkers.append({
                "member_name": member["name"],
                "date": test_date.isoformat(),
                "test_type": "Quarterly Panel",
                "HbA1c": round(hba1c, 2),
                "BP_Systolic": round(bp_systolic, 1),
                "ApoB": round(apob, 1),
                "hs-CRP": random.uniform(0.5, 2.0)
            })
    
    df = pd.DataFrame(biomarkers)
    df.to_csv(BIOMARKERS_OUTPUT_PATH, index=False)
    print(f"✅ Biomarkers data generated at {BIOMARKERS_OUTPUT_PATH}")

def generate_wearables(members):
    wearables = []
    start_date = datetime.date(2025, 8, 1)
    
    for member in members:
        for day in range(8 * 30):
            current_date = start_date + datetime.timedelta(days=day)
            
            # Simulate slight improvement over time
            hrv = random.uniform(30, 60) + (day/240) * 10
            sleep_score = random.uniform(60, 85) + (day/240) * 5
            rhr = random.uniform(55, 70) - (day/240) * 3
            
            wearables.append({
                "member_name": member["name"],
                "date": current_date.isoformat(),
                "HRV": round(hrv, 1),
                "Sleep_Score": round(sleep_score, 1),
                "Resting_Heart_Rate": round(rhr, 1)
            })
    
    df = pd.DataFrame(wearables)
    df.to_csv(WEARABLES_OUTPUT_PATH, index=False)
    print(f"✅ Wearables data generated at {WEARABLES_OUTPUT_PATH}")

if __name__ == "__main__":
    # This script will be called by run_pipeline.py, which will provide members
    # For a standalone test, you can load a sample member profile here
    try:
        profiles_file = "data/member_profiles.json"
        with open(profiles_file) as f:
            members_data = json.load(f)
        generate_biomarkers(members_data)
        generate_wearables(members_data)
    except FileNotFoundError:
        print(f"Error: {profiles_file} not found.")
