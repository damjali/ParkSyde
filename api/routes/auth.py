from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi import APIRouter, HTTPException, Depends, status
from typing import Annotated, List
import api.models as models
from api.models import Users
from api.config.database import SessionLocal, engine
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from datetime import timedelta, datetime
from jose import JWTError, jwt
import os
from dotenv import load_dotenv

app = APIRouter()

models.Base.metadata.create_all(bind=engine)

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]

bcrypt_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_bearer = OAuth2PasswordBearer(tokenUrl="token")

class User(BaseModel):
    email: str
    hashed_password: str
    pin_number: str
    phone_number: str

class CreateUserRequest(BaseModel):
    email: str
    password: str

@app.get("/allUsers")
async def get_all_users(db: db_dependency):
    users = db.query(Users).all()
    return users

@app.post("/users")
async def create_user(create_user_request: CreateUserRequest, db: db_dependency):
    try:
        user_model = Users(
            email=create_user_request.email,
            hashed_password=bcrypt_context.hash(create_user_request.password)
        )
        db.add(user_model)
        db.commit()
        db.refresh(user_model)
        return user_model
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/users/{user_id}")
async def get_user(user_id: str, db: db_dependency):
    user = db.query(Users).filter(Users.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.delete("/users/{user_id}")
async def delete_user(user_id: str, db: db_dependency):
    try:
        user = db.query(Users).filter(Users.user_id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        db.delete(user)
        db.commit()
        return {"detail": "User deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def authenticate_user(email: str, password: str, db):
    user = db.query(Users).filter(Users.email == email).first()
    if not user:
        return False
    if not bcrypt_context.verify(password, user.hashed_password):
        return False
    return user

def create_access_token(user_id: str, email: str, pin_number: str, phone_number: str, expires_delta: timedelta = None):
    user_id = str(user_id)  # Ensure user_id is a string
    encode = {'sub': email, 'user_id': user_id, 'pin_number': pin_number, 'phone_number': phone_number}
    if expires_delta:
        expires = datetime.utcnow() + expires_delta
    else:
        expires = datetime.utcnow() + timedelta(minutes=60)
    encode.update({"exp": expires})
    return jwt.encode(encode, SECRET_KEY, algorithm=ALGORITHM)

class Token(BaseModel):
    access_token: str
    token_type: str

@app.post("/token", response_model=Token)
async def login_for_access_token(form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
                                  db: db_dependency):
    user = authenticate_user(form_data.username, form_data.password, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    token = create_access_token(user.user_id, user.email, user.pin_number, user.phone_number)

    return {
        "access_token": token,
        "token_type": "bearer"
    }

async def get_current_user(token: Annotated[str, Depends(oauth2_bearer)]):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        user_id: str = payload.get("user_id")
        pin_number: str = payload.get("pin_number")
        phone_number: str = payload.get("phone_number")
        if email is None or user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials"
            )
        return {'email': email, 'user_id': user_id, 'pin_number': pin_number, 'phone_number': phone_number}
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials"
        )
    
@app.get("/is_authenticated")
async def is_authenticated(token: Annotated[str, Depends(oauth2_bearer)]):
    try:
        user = await get_current_user(token)
        return user
    except HTTPException:
        return False
    
class UpdateUserRequest(BaseModel):
    user_id: str
    pin_number: str | None = None
    phone_number: str | None = None

@app.patch("/update")
async def update_user(db: db_dependency,
                        update_user_request: UpdateUserRequest):
    try:
        user_model = db.query(Users).filter(Users.user_id == update_user_request.user_id).first()
        if not user_model:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

        if update_user_request.pin_number is not None:
            user_model.pin_number = update_user_request.pin_number
        if update_user_request.phone_number is not None:
            user_model.phone_number = update_user_request.phone_number

        db.commit()
        db.refresh(user_model)
        return user_model
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))