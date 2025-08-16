# backend/services/persona_service.py

class PersonaService:
    def get_persona_evolution(self, member_id: str):
        """
        Simulates getting persona summaries over time.
        In a real app, this would pull from persona_summaries.json.
        """
        # Placeholder data
        return [
            {"month": 1, "summary": "Engaged with onboarding, high initial motivation."},
            {"month": 3, "summary": "Adjusting to travel, focusing on nutrition tweaks."},
            {"month": 6, "summary": "Strong progress on cardio health, consistent with plan."},
        ]

# Instantiate the service
persona_service = PersonaService()
