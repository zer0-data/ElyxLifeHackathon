# backend/app.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from .routes import chats, decisions, biomarkers, why_agent

# Initialize FastAPI app
app = FastAPI(
    title="Elyx Health API",
    description="API for accessing member health data and a 'Why-Agent' for decision context.",
    version="1.0.0",
)

# CORS (Cross-Origin Resource Sharing) middleware
# Allows your frontend (running on a different port) to access the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to specific frontend URLs in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount the routes
app.include_router(chats.router, tags=["Chats"])
app.include_router(decisions.router, tags=["Decisions"])
app.include_router(biomarkers.router, tags=["Biomarkers"])
app.include_router(why_agent.router, tags=["Why Agent"])

# Serve static files from the 'frontend' directory
# You will need to create a 'frontend' directory and place your HTML/CSS/JS there
# For this example, we'll assume it's one level up from 'backend'
try:
    app.mount("/", StaticFiles(directory="../frontend", html=True), name="static")
except RuntimeError:
    print("Warning: 'frontend' directory not found. Static file serving will be skipped.")

if __name__ == "__main__":
    import uvicorn
    # This runs the server on a port accessible within Colab
    uvicorn.run(app, host="0.0.0.0", port=8000)
