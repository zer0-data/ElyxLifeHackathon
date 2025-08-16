# backend/routes/biomarkers.py

from fastapi import APIRouter
from ..services.biomarker_service import biomarker_service

router = APIRouter()

@router.get("/biomarkers/{member_name}/{biomarker}")
def get_biomarker_data(member_name: str, biomarker: str):
    """
    Returns biomarker trend data for a specific member and biomarker.
    Example: /biomarkers/Aria%20Smith/HbA1c
    """
    data = biomarker_service.get_biomarker_trends(member_name, biomarker)
    if not data:
        return {"error": "Data not found or member/biomarker is invalid."}, 404
    return data
