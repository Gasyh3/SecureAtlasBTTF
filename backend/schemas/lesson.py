from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class LessonCreate(BaseModel):
    course_id: int = Field(..., description="ID du cours auquel appartient la leçon")
    title: str = Field(..., min_length=1, max_length=255, description="Titre de la leçon")
    content: Optional[str] = Field(None, description="Contenu de la leçon")
    order_index: int = Field(..., ge=0, description="Index d'ordre de la leçon dans le cours")

class LessonUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255, description="Titre de la leçon")
    content: Optional[str] = Field(None, description="Contenu de la leçon")
    order_index: Optional[int] = Field(None, ge=0, description="Index d'ordre de la leçon")

class LessonRead(BaseModel):
    id: int
    course_id: int
    title: str
    content: Optional[str]
    order_index: int
    created_at: datetime

    class Config:
        from_attributes = True

class LessonList(BaseModel):
    """Schéma pour la liste paginée des leçons"""
    id: int
    course_id: int
    title: str
    order_index: int
    created_at: datetime

    class Config:
        from_attributes = True 