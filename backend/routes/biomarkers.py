# backend/routes/biomarkers.py

from fastapi import APIRouter
import pandas as pd
import os
from ..config import BIOMARKER_DATA_PATH

router = APIRouter()

@router.get("/biomarkers/{member_name}/{biomarker}")
def get_biomarker_data(member_name: str, biomarker: str):
    """
    Returns biomarker trend data for a specific member and biomarker.
    """
    if not os.path.exists(BIOMARKER_DATA_PATH):
        return {"error": f"Biomarker data not found at {BIOMARKER_DATA_PATH}"}, 404

    try:
        df = pd.read_csv(BIOMARKER_DATA_PATH)
    except Exception as e:
        return {"error": f"Error reading biomarker data: {e}"}, 500
        
    member_df = df[df['member_name'] == member_name]
    if member_df.empty or biomarker not in member_df.columns:
        return {"error": f"Data not found or member/biomarker is invalid."}, 404
    
    return member_df[['date', biomarker]].to_dict('records')
