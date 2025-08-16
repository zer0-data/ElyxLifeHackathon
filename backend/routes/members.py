# backend/routes/members.py

from fastapi import APIRouter
import json
import os
from ..config import CHAT_DATA_PATH

router = APIRouter()

@router.get("/members")
def get_members():
    """Returns all member profiles from the JSON file."""
    try:
        with open(CHAT_DATA_PATH, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return {"error": "Member profiles data not found."}, 404
    except json.JSONDecodeError:
        return {"error": "Invalid JSON format in member profiles file."}, 500
