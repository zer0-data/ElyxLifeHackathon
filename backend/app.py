# backend/app.py

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from .routes import chats, decisions, biomarkers, why_agent, members, persona_summaries, internal_metrics

# Get the absolute path to the directory containing this script
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# Navigate up one level to the project root directory
PROJECT_ROOT = os.path.dirname(BASE_DIR)

# Initialize FastAPI app
app = FastAPI(
    title="Elyx Health API",
    description="API for accessing member health data and a 'Why-Agent' for decision context.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chats.router, tags=["Chats"])
app.include_router(decisions.router, tags=["Decisions"])
app.include_router(biomarkers.router, tags=["Biomarkers"])
app.include_router(why_agent.router, tags=["Why Agent"])
app.include_router(members.router, tags=["Members"])
app.include_router(persona_summaries.router, tags=["Persona Summaries"])
app.include_router(internal_metrics.router, tags=["Internal Metrics"])


# Mount the static files from the 'frontend' directory using an absolute path
FRONTEND_DIR = os.path.join(PROJECT_ROOT, "frontend")
try:
    if os.path.isdir(FRONTEND_DIR):
        app.mount("/", StaticFiles(directory=FRONTEND_DIR, html=True), name="static")
    else:
        print(f"Warning: 'frontend' directory not found at {FRONTEND_DIR}. Static file serving will be skipped.")
except RuntimeError:
    print(f"Warning: 'frontend' directory not found at {FRONTEND_DIR}. Static file serving will be skipped.")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
