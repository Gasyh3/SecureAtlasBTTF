from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List
from models.course import CourseLevel

class CourseCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=255, description="Titre du cours")
    description: Optional[str] = Field(None, description="Description du cours")
    level: CourseLevel = Field(..., description="Niveau du cours (beginner, intermediate, advanced)")

class CourseUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255, description="Titre du cours")
    description: Optional[str] = Field(None, description="Description du cours")
    level: Optional[CourseLevel] = Field(None, description="Niveau du cours")

class CourseRead(BaseModel):
    id: int
    title: str
    description: Optional[str]
    level: CourseLevel
    created_at: datetime

    class Config:
        from_attributes = True

class CourseList(BaseModel):
    """Schéma pour la liste paginée des cours"""
    id: int
    title: str
    level: CourseLevel
    created_at: datetime

    class Config:
        from_attributes = True 