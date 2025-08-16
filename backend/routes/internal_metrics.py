# backend/routes/internal_metrics.py

from fastapi import APIRouter
import json
import os
from ..config import INTERNAL_METRICS_PATH

router = APIRouter()

@router.get("/internal_metrics")
def get_internal_metrics():
    """Returns the internal metrics from the JSON file."""
    try:
        with open(INTERNAL_METRICS_PATH, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return {"error": f"Internal metrics data not found at {INTERNAL_METRICS_PATH}"}, 404
    except json.JSONDecodeError:
        return {"error": f"Invalid JSON format in {INTERNAL_METRICS_PATH}"}, 500
