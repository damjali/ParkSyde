from fastapi import FastAPI, HTTPException, Depends, APIRouter
from typing import Annotated, List
import api.models as models
from api.config.database import SessionLocal, engine
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import datetime

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
    nfc_code: str | None = None
    
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

@router.post("/cars")
async def create_car(car: CarBase, db: db_dependency):
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
