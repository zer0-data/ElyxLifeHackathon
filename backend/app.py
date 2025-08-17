from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import csv
import pandas as pd
import os
from datetime import datetime
import openai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configure OpenAI
openai.api_key = os.getenv('OPENAI_API_KEY')

# Data paths
DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data')

def load_json_data(filename):
    """Load JSON data from the data directory"""
    try:
        with open(os.path.join(DATA_DIR, filename), 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading {filename}: {e}")
        return {}

def load_csv_data(filename):
    """Load CSV data from the data directory"""
    try:
        return pd.read_csv(os.path.join(DATA_DIR, filename))
    except Exception as e:
        print(f"Error loading {filename}: {e}")
        return pd.DataFrame()

@app.route('/api/member/profile', methods=['GET'])
def get_member_profile():
    """Get member profile data"""
    try:
        profiles = load_json_data('member_profiles.json')
        if profiles and len(profiles) > 0:
            return jsonify(profiles[0])
        return jsonify({"error": "No member profile found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/member/chats', methods=['GET'])
def get_member_chats():
    """Get member chat data"""
    try:
        chats = load_json_data('chat_data.json')
        return jsonify(chats)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/member/biomarkers', methods=['GET'])
def get_member_biomarkers():
    """Get member biomarker data"""
    try:
        biomarkers_df = load_csv_data('biomarkers.csv')
        if biomarkers_df.empty:
            return jsonify({"error": "No biomarker data found"}), 404
        
        # Convert to JSON format
        biomarkers_data = biomarkers_df.to_dict('records')
        
        # Clean up any NaN values that might exist
        for record in biomarkers_data:
            for key, value in record.items():
                if pd.isna(value):
                    record[key] = None
        
        # Group by marker name for easier frontend consumption
        grouped_data = {}
        for record in biomarkers_data:
            marker = record['marker_name']
            if marker not in grouped_data:
                grouped_data[marker] = []
            grouped_data[marker].append({
                'month': record['month'],
                'date': record['date'],
                'value': record['value'],
                'unit': record['unit'],
                'notes': record['notes']
            })
        
        return jsonify({
            'raw_data': biomarkers_data,
            'grouped_data': grouped_data
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/member/wearables', methods=['GET'])
def get_member_wearables():
    """Get member wearables data"""
    try:
        wearables_df = load_csv_data('wearables.csv')
        if wearables_df.empty:
            return jsonify({"error": "No wearables data found"}), 404
        
        # Replace empty strings and 'N/A' with None for proper JSON serialization
        wearables_df = wearables_df.replace(['', 'N/A', 'NaN'], None)
        
        # Convert numeric columns to proper types, handling None values
        numeric_columns = ['sleep_score_100', 'hrv_ms', 'rhr_bpm', 'respiratory_rate_brpm', 'strain_score_21', 'recovery_score_pct']
        for col in numeric_columns:
            if col in wearables_df.columns:
                wearables_df[col] = pd.to_numeric(wearables_df[col], errors='coerce')
        
        # Convert to dict and replace NaN values with None for proper JSON serialization
        wearables_data = wearables_df.to_dict('records')
        
        # Clean up NaN values that might still exist
        for record in wearables_data:
            for key, value in record.items():
                if pd.isna(value):
                    record[key] = None
        
        return jsonify(wearables_data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/member/test-reports', methods=['GET'])
def get_member_test_reports():
    """Get member test reports"""
    try:
        test_reports = load_json_data('test_panel.json')
        return jsonify(test_reports)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/member/diagnostics', methods=['GET'])
def get_member_diagnostics():
    """Get member diagnostic plans"""
    try:
        diagnostics = load_json_data('diagnostics_plan.json')
        return jsonify(diagnostics)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/member/internal-metrics', methods=['GET'])
def get_internal_metrics():
    """Get internal metrics data"""
    try:
        metrics = load_json_data('internal_metrics.json')
        return jsonify(metrics)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/chat/query', methods=['POST'])
def chat_query():
    """Handle chat queries using OpenAI API with context from chat_data and persona_summaries"""
    try:
        data = request.get_json()
        user_query = data.get('query', '')
        
        if not user_query:
            return jsonify({"error": "Query is required"}), 400
        
        # Load context data
        chat_data = load_json_data('chat_data.json')
        persona_summaries = load_json_data('persona_summaries.json')
        member_profile = load_json_data('member_profiles.json')
        
        # Prepare context for OpenAI
        context = f"""
        You are an AI assistant helping with queries about Rohan Patel's health journey. You have access to:
        
        Member Profile: {json.dumps(member_profile[0] if member_profile else {}, indent=2)}
        
        Chat History: You have access to detailed communication logs between Rohan and his health team (Ruby the concierge, Dr. Warren the medical strategist, and other team members).
        
        Persona Evolution: You understand how Rohan's engagement and mindset has evolved over time through different phases.
        
        Please answer the user's query based on this context. Be specific and reference actual data points when possible.
        
        User Query: {user_query}
        """
        
        # Call OpenAI API
        try:
            response = openai.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a helpful assistant that analyzes health data and provides insights about Rohan Patel's health journey."},
                    {"role": "user", "content": context}
                ],
                max_tokens=1000,
                temperature=0.7
            )
            ai_response = response.choices[0].message.content
            return jsonify({"response": ai_response})
        except Exception as openai_error:
            # Fallback response if OpenAI API fails
            return jsonify({
                "response": f"I'm sorry, I'm currently unable to process your query due to an API issue. Please make sure your OpenAI API key is configured correctly. Error: {str(openai_error)}"
            })
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "timestamp": datetime.now().isoformat()})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
