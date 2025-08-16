# backend/routes/decisions.py

from fastapi import APIRouter
import json
from ..config import DECISIONS_DATA_PATH

router = APIRouter()

@router.get("/decisions")
def get_decisions():
    """Returns all structured decisions/interventions."""
    try:
        with open(DECISIONS_DATA_PATH, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return {"error": "Decisions data not found."}, 404
