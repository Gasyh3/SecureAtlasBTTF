from sqlalchemy import Column, Integer, String, Enum, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from db import Base
import enum

class RoleEnum(str, enum.Enum):
    student = "student"
    instructor = "instructor"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=True)
    email = Column(String, unique=True, index=True, nullable=False)
    firstname = Column(String(100), nullable=True)
    lastname = Column(String(100), nullable=True)
    picture_profile = Column(String(500), nullable=True)  # URL to profile picture
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(RoleEnum), default=RoleEnum.student, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relations
    enrollments = relationship("Enrollment", back_populates="user") 