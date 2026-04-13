import os
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai
import json

# טעינת משתני הסביבה מקובץ ה-.env (שלא יעלה לגיטהאב!)
load_dotenv()

# שליפת מפתח ה-API בבטחה
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("GEMINI_API_KEY is missing from the environment variables.")

client = genai.Client(api_key=api_key)

app = FastAPI(title="AI Cyber Security Scanner")

# מאפשרים ל-React לדבר עם השרת שלנו
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CodeRequest(BaseModel):
    code: str
    language: str

@app.post("/scan")
async def scan_code(request: CodeRequest):
    if not request.code:
        raise HTTPException(status_code=400, detail="No code provided")

    try:
        print(f"Scanning {request.language} code...")

        prompt = f"""
        You are an expert Cyber Security analyst. 
        Analyze the following {request.language} code for security vulnerabilities.
        
        You MUST respond ONLY with a valid JSON array of objects. Do not add any markdown formatting like ```json or normal text.
        If no vulnerabilities are found, return an empty array [].
        
        Each object in the array must have exactly these keys:
        - "vulnerability": (string) Short name of the issue (e.g., "SQL Injection").
        - "severity": (string) "High", "Medium", or "Low".
        - "line_snippet": (string) The specific line of code that is vulnerable.
        - "description": (string) Brief explanation of the risk.
        - "remediation": (string) How to fix it.

        Code to analyze:
        {request.code}
        """

        response = client.models.generate_content(
            model="gemini-2.5-flash", contents=prompt
        )

        clean_json_str = response.text.strip()
        if clean_json_str.startswith("```json"):
            clean_json_str = clean_json_str[7:-3].strip()

        vulnerabilities = json.loads(clean_json_str)

        return {"status": "success", "results": vulnerabilities}

    except Exception as e:
        print("Error during scan:", e)
        raise HTTPException(status_code=500, detail="AI Scanning failed")