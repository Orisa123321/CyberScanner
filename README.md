# AI Cyber Security Scanner 🛡️

An advanced cybersecurity tool built with Python (FastAPI), React, and Google's Gemini AI. 
This application analyzes source code snippets in real-time, identifies security vulnerabilities (such as SQL Injections, XSS, etc.), evaluates their severity, and provides actionable remediation steps.

## Features
* **AI-Powered Analysis**: Utilizes LLMs to detect complex vulnerabilities.
* **RESTful API**: Fast and robust backend built with FastAPI.
* **Frontend Dashboard**: Interactive UI built with React.
* **Secure Design**: Strict environment variable handling and Git security best practices.

## Tech Stack
* **Backend:** Python, FastAPI, Uvicorn, Google GenAI SDK
* **Frontend:** React.js
* **Security:** python-dotenv for secret management

## How to Run Locally

### 1. Backend Setup
1. Clone the repository.
2. Create a `.env` file in the root directory and add your Gemini API Key:
   `GEMINI_API_KEY=your_actual_api_key_here`
3. Install dependencies:
   `pip install -r requirements.txt`
4. Start the server:
   `uvicorn main:app --reload`

### 2. Frontend Setup
1. Navigate to the `frontend` folder: `cd frontend`
2. Install Node dependencies: `npm install`
3. Start the React application: `npm start`

## Testing the API
You can run the `test_api.py` script to send a mock vulnerable code (SQL Injection) to the scanner and see the JSON response from the AI.