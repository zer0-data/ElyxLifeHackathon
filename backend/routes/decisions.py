# backend/routes/decisions.py

from fastapi import APIRouter
import json
import os
from ..config import DECISIONS_DATA_PATH

router = APIRouter()

@router.get("/decisions")
def get_decisions():
    """Returns all structured decisions/interventions."""
    try:
        with open(DECISIONS_DATA_PATH, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return {"error": f"Decisions data not found at {DECISIONS_DATA_PATH}"}, 404
    except json.JSONDecodeError:
        return {"error": f"Invalid JSON format in {DECISIONS_DATA_PATH}"}, 500
