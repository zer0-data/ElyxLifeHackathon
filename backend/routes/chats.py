# backend/routes/chats.py

from fastapi import APIRouter, Query
import json
import os
from ..config import CHAT_DATA_PATH

router = APIRouter()

@router.get("/chats")
def get_chats(member_name: str = None):
    """
    Returns all chat messages, optionally filtered by member name.
    """
    try:
        with open(CHAT_DATA_PATH, 'r') as f:
            all_chats = json.load(f)
    except FileNotFoundError:
        return {"error": f"Chat data not found at {CHAT_DATA_PATH}"}, 404
    except json.JSONDecodeError:
        return {"error": f"Invalid JSON format in {CHAT_DATA_PATH}"}, 500

    if member_name:
        # Filter chats for the specified member
        return [chat for chat in all_chats if chat["sender"] == member_name or chat["role"] != "Member"]
    
    return all_chats
