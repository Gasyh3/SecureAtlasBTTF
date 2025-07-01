from sqlalchemy import Column, Integer, String, Enum
from sqlalchemy.orm import relationship
from db import Base
import enum

class RoleEnum(str, enum.Enum):
    student = "student"
    instructor = "instructor"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(RoleEnum), default=RoleEnum.student, nullable=False)
    
    # Relations
    enrollments = relationship("Enrollment", back_populates="user") 