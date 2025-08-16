# backend/services/biomarker_service.py

import pandas as pd
from ..config import BIOMARKER_DATA_PATH

class BiomarkerService:
    def __init__(self):
        self.df = self._load_data()

    def _load_data(self):
        try:
            return pd.read_csv(BIOMARKER_DATA_PATH)
        except FileNotFoundError:
            print(f"Error loading biomarker data: {BIOMARKER_DATA_PATH} not found.")
            return pd.DataFrame()

    def get_biomarker_trends(self, member_name: str, biomarker: str):
        """Fetches trend data for a specific biomarker and member."""
        if self.df.empty:
            return []
            
        member_df = self.df[self.df['member_name'] == member_name]
        if member_df.empty or biomarker not in member_df.columns:
            return []
        
        return member_df[['date', biomarker]].to_dict('records')

# Instantiate the service
biomarker_service = BiomarkerService()
