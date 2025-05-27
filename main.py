from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from api.routes.route import router
from api.routes.auth import app as auth_app
import os
import requests

app = FastAPI()



# Include the route and auth apps
app.include_router(router, tags=["cars"])
app.include_router(auth_app, tags=["auth"])

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

API_KEY = os.getenv("D360_API_KEY")
YOUR_NUMBER = os.getenv("YOUR_PHONE_NUMBER")
BASE_URL = "https://waba-sandbox.360dialog.io/v1"

headers = {
    "D360-API-KEY": API_KEY,
    "Content-Type": "application/json"
}


# Webhook Receiver
@app.post("/webhook")
async def receive_message(request: Request):
    try:
        body = await request.json()
        print("Received message:", body)

        message = body['messages'][0]['text']['body']
        sender = body['contacts'][0]['wa_id']

        # Auto-respond
        send_text_message(sender, f"Auto-reply: You said '{message}'")

    except KeyError as e:
        print("Missing key in request body:", e)
    except Exception as e:
        print("Unexpected error:", e)

    return {"status": "received"}

def send_text_message(recipient_number: str, text: str):
    payload = {
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": recipient_number,
        "type": "text",
        "text": {
            "body": text
        }
    }

    try:
        response = requests.post(
            f"{BASE_URL}/messages",
            json=payload,
            headers=headers,
            timeout=5
        )
        print("Send message status:", response.status_code)
        print("Send message response JSON:", response.json())
    except requests.exceptions.RequestException as e:
        print("Request failed:", e)
