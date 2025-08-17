#!/usr/bin/env python
import sys
import os

# Add the backend directory to Python path
backend_dir = os.path.join(os.path.dirname(__file__), 'backend')
sys.path.insert(0, backend_dir)

# Change to backend directory
os.chdir(backend_dir)

# Import and run the Flask app
try:
    from app import app
    print("Starting Elyx Health Dashboard Backend...")
    print("Backend will be available at: http://localhost:5000")
    print("Press Ctrl+C to stop the server")
    app.run(debug=True, port=5000, host='127.0.0.1')
except ImportError as e:
    print(f"Error importing app: {e}")
    print("Make sure all dependencies are installed: pip install -r requirements.txt")
except Exception as e:
    print(f"Error starting server: {e}")
    input("Press Enter to exit...")
