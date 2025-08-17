# Elyx Health Dashboard

A comprehensive health dashboard for viewing member data, including chat history, biomarker trends, test reports, wearables data, diagnostic plans, and an AI-powered chat assistant.

## Features

- **Member Profile**: View detailed member information including health goals and chronic conditions
- **Chat History**: Complete communication history between member and health team
- **Biomarker Trends**: Interactive charts showing biomarker changes over time
- **Monthly Test Reports**: Detailed test panels organized by month
- **Wearables Data**: Sleep scores, HRV, heart rate, and other wearable device metrics
- **Diagnostic Plans**: Phased diagnostic strategies and monthly plans
- **Internal Metrics**: Service utilization and engagement analytics
- **AI Chat Assistant**: Query member data using OpenAI's GPT models

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   
4. Edit the `.env` file and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_actual_openai_api_key_here
   FLASK_ENV=development
   ```

5. Run the Flask backend:
   ```bash
   python app.py
   ```

The backend will start on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Open `index.html` in a web browser, or serve it using a simple HTTP server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js (if you have it installed)
   npx serve .
   ```

3. Open your browser and navigate to:
   - `http://localhost:8000` (if using a server)
   - Or simply open `index.html` directly in your browser

## Usage

1. **Start the Backend**: Make sure the Flask backend is running on port 5000
2. **Open the Frontend**: Load the frontend in your browser
3. **Select Member**: Click on Rohan Patel's card to enter the dashboard
4. **Navigate Tabs**: Use the tab navigation to explore different data views
5. **AI Chat**: Use the AI Assistant tab to ask questions about the member's health journey

## API Endpoints

- `GET /api/member/profile` - Get member profile data
- `GET /api/member/chats` - Get member chat history
- `GET /api/member/biomarkers` - Get biomarker trends
- `GET /api/member/wearables` - Get wearables data
- `GET /api/member/test-reports` - Get monthly test reports
- `GET /api/member/diagnostics` - Get diagnostic plans
- `GET /api/member/internal-metrics` - Get internal metrics
- `POST /api/chat/query` - Send query to AI assistant

## Data Structure

The application expects the following data files in the `data/` directory:
- `member_profiles.json` - Member profile information
- `chat_data.json` - Communication history
- `biomarkers.csv` - Biomarker measurements over time
- `wearables.csv` - Wearable device data
- `test_panel.json` - Monthly test reports
- `diagnostics_plan.json` - Diagnostic plans and strategies
- `internal_metrics.json` - Service utilization metrics
- `persona_summaries.json` - Member persona evolution (used by AI chat)

## Technologies Used

- **Backend**: Flask, Python, OpenAI API
- **Frontend**: HTML, CSS (Tailwind), JavaScript, Chart.js
- **Data**: JSON files, CSV files
- **Charts**: Chart.js for interactive data visualization

## Notes

- The application is designed for a single member (Rohan Patel) as per the current data structure
- OpenAI API key is required for the AI chat functionality
- All data is loaded from static files in the `data/` directory
- The frontend uses modern JavaScript features and requires a modern browser
Hackathon project
