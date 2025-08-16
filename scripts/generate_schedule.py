# --- scripts/generate_schedule.py ---
# This script generates a day-by-day schedule for the 8-month journey.

import json
import datetime

JOURNEY_CONFIG_PATH = "config/journey_config.json"
SCHEDULE_OUTPUT_PATH = "data/schedule.json"
DAYS_PER_MONTH = 30

def generate_schedule(journey_config):
    schedule = {}
    start_date = datetime.date(2025, 8, 1)

    for month_num in range(1, 9):
        monthly_events = journey_config.get(str(month_num), {}).get("events", [])
        month_start_date = start_date + datetime.timedelta(days=(month_num - 1) * DAYS_PER_MONTH)
        
        schedule[f"Month_{month_num}"] = {
            "start_date": month_start_date.isoformat(),
            "events": monthly_events,
            "daily_details": []
        }

        for day in range(DAYS_PER_MONTH):
            current_date = month_start_date + datetime.timedelta(days=day)
            day_events = []
            
            # Simple logic to assign events to days
            if "onboarding" in monthly_events and day == 0:
                day_events.append("Member Onboarding Session")
            if "baseline_panel" in monthly_events and day == 2:
                day_events.append("Baseline Diagnostic Test Panel")
            if "plan_setup" in monthly_events and day == 7:
                day_events.append("Initial Intervention Plan Setup")
            if "travel" in monthly_events and day % 7 == 0:
                day_events.append("Start of 1-week business travel")
            if "quarterly_panel" in monthly_events and day == 1:
                day_events.append("Quarterly Diagnostic Test Panel")
            if "adherence_issue" in monthly_events and day == 10:
                day_events.append("Adherence follow-up call")
            if "nutrition_tweak" in monthly_events and day == 12:
                day_events.append("Nutrition plan adjustment")
            if "exercise_update" in monthly_events and day == 10:
                day_events.append("Exercise plan update")
            if "plan_update" in monthly_events and day == 14:
                day_events.append("Overall plan review and update")
            if "advanced_cardio_test" in monthly_events and day == 5:
                day_events.append("Advanced Cardiovascular Assessment")
            if "jetlag_protocol" in monthly_events and day == 2:
                day_events.append("Jetlag recovery protocol call")
            if "final_review" in monthly_events and day == 28:
                day_events.append("Final 8-month review")

            schedule[f"Month_{month_num}"]["daily_details"].append({
                "date": current_date.isoformat(),
                "events": day_events
            })

    with open(SCHEDULE_OUTPUT_PATH, "w") as f:
        json.dump(schedule, f, indent=2)
    print(f"✅ Schedule generated at {SCHEDULE_OUTPUT_PATH}")

if __name__ == "__main__":
    try:
        with open(JOURNEY_CONFIG_PATH) as f:
            journey_config = json.load(f)
        generate_schedule(journey_config)
    except FileNotFoundError:
        print(f"Error: {JOURNEY_CONFIG_PATH} not found. Please create it.")
