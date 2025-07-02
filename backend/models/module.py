from sqlalchemy import Column, Integer, String, Text, DateTime, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
from db import Base
import enum

class ModuleType(str, enum.Enum):
    text = "text"
    video = "video"

class CourseModule(Base):
    __tablename__ = "course_modules"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), index=True, nullable=False)
    content = Column(Text, nullable=False)
    type = Column(Enum(ModuleType), default=ModuleType.text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    quiz = relationship("Quiz", back_populates="module", uselist=False) 