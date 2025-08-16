# backend/routes/chats.py

from fastapi import APIRouter
import json
from ..config import CHAT_DATA_PATH

router = APIRouter()

@router.get("/chats")
def get_chats():
    """Returns all chat messages."""
    try:
        with open(CHAT_DATA_PATH, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return {"error": "Chat data not found."}, 404
