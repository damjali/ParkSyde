import requests
import requests
from fastapi import FastAPI, HTTPException, Depends, APIRouter
from typing import Annotated, List
import api.models as models
from api.config.database import SessionLocal, engine
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import datetime
from pyngrok import ngrok
import os
from twilio.rest import Client

router = APIRouter()
models.Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]

class CarBase(BaseModel):
    plateNumber: str 
    user_id: str
    car_status: bool | None = 0
    activated_at: datetime | None = None
    nfc_code: str
    
@router.get("/allCars")
async def get_all_cars(db: db_dependency):
    cars = db.query(models.Cars).all()
    return cars

@router.get("/cars/{plateNumber}")
async def get_car(plateNumber: str, db: db_dependency):
    car = db.query(models.Cars).filter(models.Cars.plateNumber == plateNumber).first()
    if not car:
        return False
    return car

# for calls
@router.get("/userPhoneNumber/{plateNumber}")
async def get_user_phone_number(plateNumber: str, db: db_dependency):
    car = get_car(plateNumber, db)
    if not car:
        raise HTTPException(status_code=404, detail="Car not found")
    
    user = db.query(models.Users).filter(models.Users.id == car.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {"phone_number": user.phone_number}

class CreateCarBase(BaseModel):
    plateNumber: str 
    user_id: str
    car_status: bool | None = 0

@router.post("/cars")
async def create_car(car: CreateCarBase, db: db_dependency):
    try:
        car_model = models.Cars(
            plateNumber=car.plateNumber.upper(),
            user_id=car.user_id,
            car_status=car.car_status
        )
        db.add(car_model)
        db.commit()
        db.refresh(car_model)
        return car_model
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/carsUser/{user_id}")
async def get_cars_by_user(user_id: str, db: db_dependency):
    cars = db.query(models.Cars).filter(models.Cars.user_id == user_id).all()
    if not cars:
        raise HTTPException(status_code=404, detail="No cars found for this user")
    return [{"plateNumber": car.plateNumber} for car in cars]

class CarStatus(BaseModel):
    plateNumber: str 
    status: bool | None = False
    activated_at: datetime | None = None

@router.put("/cars/status")
async def update_car_status(change: CarStatus, db: db_dependency):
    print(change)
    car = db.query(models.Cars).filter(models.Cars.plateNumber == change.plateNumber).first()
    if not car:
        raise HTTPException(status_code=404, detail="Car not found")
    
    car.car_status = change.status
    car.activated_at = datetime.now() if change.status else None
    db.commit()
    db.refresh(car)
    return car

@router.delete("/cars/{plateNumber}")
async def delete_car(plateNumber: str, db: db_dependency):
    car = db.query(models.Cars).filter(models.Cars.plateNumber == plateNumber).first()
    if not car:
        raise HTTPException(status_code=404, detail="Car not found")
    
    db.delete(car)
    db.commit()
    return {"detail": "Car deleted successfully"}




def send_text_message(text):
    print("send_text_message called")
    API_KEY = "Tj0XeX_sandbox"  #To Alysha
    PHONE_NUMBER = "60182237077"
    url = "https://waba-sandbox.360dialog.io/v1/messages"
    headers = {
        "D360-API-KEY": API_KEY,
        "Content-Type": "application/json"
    }
    payload = {
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": PHONE_NUMBER,
        "type": "text",
        "text": {
            "body": text
        }
    }
    try:
        response = requests.post(url, headers=headers, json=payload)
        print("Send message status:", response.status_code)
        print(response.json())
    except Exception as e:
        print(f"Error sending message: {e}")
        return {"status": "error", "message": str(e)}
    return {"status": "message sent"}

@router.get("/send-message-notify-owner")
async def send_message():
    send_text_message("YOUR CAR IS BLOCKING ME")
    return {"status": "message sent"}

@router.get("/carsUser/status/{user_id}")
async def get_car_status_by_user(user_id: str, db: db_dependency):
    cars = db.query(models.Cars).filter(models.Cars.user_id == user_id).all()
    if not cars:
        raise HTTPException(status_code=404, detail="No cars found for this user")
    
    return [
        {
            "plateNumber": car.plateNumber,
            "car_status": car.car_status
        }
        for car in cars
    ]

@router.post("/call-owner")
async def call_owner():
    # Twilio credentials - replace with your actual credentials
    account_sid = os.getenv("TWILIO_ACCOUNT_SID")
    auth_token = os.getenv("TWILIO_AUTH_TOKEN")
    twilio_phone_number = os.getenv("TWILIO_PHONE_NUMBER")
    
    # Hardcoded phone number
    owner_phone_number = "+60182237077"
    
    try:
        client = Client(account_sid, auth_token)
        
        call = client.calls.create(
            to=owner_phone_number,
            from_=twilio_phone_number,
            twiml='<Response><Say>Hello, your car is blocking someone. Please move your car immediately. Thank you.</Say></Response>'
        )
        
        print(f"Call initiated with SID: {call.sid}")
        return {"status": "call initiated", "call_sid": call.sid}
    
    except Exception as e:
        print(f"Error making call: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to make call: {str(e)}")