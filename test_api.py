import requests
import json

url = "http://127.0.0.1:8000/scan"

bad_code = """
def login(username, password):
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    
    query = f"SELECT * FROM users WHERE username='{username}' AND password='{password}'"
    
    cursor.execute(query)
    user = cursor.fetchone()
    return user
"""

payload = {
    "code": bad_code,
    "language": "python"
}

print("Sending vulnerable code to the AI Scanner...")

try:
    response = requests.post(url, json=payload)
    
    if response.status_code == 200:
        print("\n✅ Success! Here is the AI's analysis:\n")
        print(json.dumps(response.json(), indent=4, ensure_ascii=False))
    else:
        print(f"❌ Error {response.status_code}: {response.text}")

except requests.exceptions.ConnectionError:
    print("❌ Connection Error: Is your FastAPI server running?")