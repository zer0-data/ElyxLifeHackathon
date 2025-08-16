# backend/routes/persona_summaries.py

from fastapi import APIRouter
import json
import os
from ..config import PERSONA_SUMMARIES_PATH

router = APIRouter()

@router.get("/persona_summaries")
def get_persona_summaries():
    """Returns all persona summaries from the JSON file."""
    try:
        with open(PERSONA_SUMMARIES_PATH, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return {"error": "Persona summaries data not found."}, 404
    except json.JSONDecodeError:
        return {"error": "Invalid JSON format in persona summaries file."}, 500
