from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from .config.database import Base

class Users(Base):
    __tablename__ = "users"

    user_id = Column(UUID(as_uuid=True), primary_key=True, index=True, server_default=func.gen_random_uuid())
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    pin_number = Column(String, default=None)
    phone_number = Column(String, default=None)

class Cars(Base):
    __tablename__ = "cars"

    plateNumber = Column(String, primary_key=True, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id"))
    car_status = Column(Boolean, default=False)
    activated_at = Column(DateTime, default=None)