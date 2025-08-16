# --- scripts/run_pipeline.py ---
# This is the main pipeline runner.

import os
import json
import importlib.util
import sys

# Define file paths
PROFILES_PATH = "data/member_profiles.json"
JOURNEY_CONFIG_PATH = "config/journey_config.json"
CHAT_OUTPUT_PATH = "data/chat_data.json"

def run_script(script_name: str, **kwargs):
    """Dynamically loads and runs a script function with arguments."""
    spec = importlib.util.spec_from_file_location("module.name", script_name)
    module = importlib.util.module_from_spec(spec)
    sys.modules["module.name"] = module
    spec.loader.exec_module(module)
    if "generate_chats" in script_name:
        return module.generate_chats_for_months(**kwargs)
    elif "simulate_biomarkers" in script_name:
        module.generate_biomarkers(kwargs['members'])
        module.generate_wearables(kwargs['members'])
    else:
        module.main()

if __name__ == "__main__":
    print("🚀 Starting the Elyx data generation pipeline...")

    # Create directories if they don't exist
    os.makedirs("config", exist_ok=True)
    os.makedirs("data", exist_ok=True)
    
    # --- IMPORTANT for Colab: Upload your files here ---
    # You MUST upload member_profiles.json and journey_config.json
    # to your Colab session's /content/data and /content/config directories.
    
    # Check if input files exist
    if not os.path.exists(PROFILES_PATH) or not os.path.exists(JOURNEY_CONFIG_PATH):
        print("❌ Error: Missing input files. Please upload member_profiles.json and journey_config.json.")
    else:
        with open(PROFILES_PATH) as f:
            member_profiles = json.load(f)
        with open(JOURNEY_CONFIG_PATH) as f:
            journey_config = json.load(f)

        all_journeys = []
        for member in member_profiles:
            member_journey = run_script("scripts/generate_chats.py", 
                                       member=member, 
                                       start_date=datetime.date(2025, 8, 1), 
                                       months=8, 
                                       journey_config=journey_config)
            all_journeys.extend(member_journey)

        with open(CHAT_OUTPUT_PATH, "w") as f:
            json.dump(all_journeys, f, indent=2)
        print(f"✅ All chat data compiled and saved to {CHAT_OUTPUT_PATH}")

        # The rest of the pipeline
        run_script("scripts/generate_schedule.py")
        run_script("scripts/generate_diagnostics_plan.py")
        run_script("scripts/simulate_biomarkers.py", members=member_profiles)
        run_script("scripts/extract_interventions.py")
        run_script("scripts/generate_persona_summaries.py")
        run_script("scripts/compute_internal_metrics.py")

        print("\n✅ Pipeline complete! All data files are in the /data folder.")
