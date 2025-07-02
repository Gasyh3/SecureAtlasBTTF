from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional
from models.module import ModuleType

class ModuleCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=255, description="Titre du module")
    content: str = Field(..., min_length=1, description="Contenu du module")
    type: ModuleType = Field(default=ModuleType.text, description="Type de module (text ou video)")

class ModuleUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255, description="Titre du module")
    content: Optional[str] = Field(None, min_length=1, description="Contenu du module")
    type: Optional[ModuleType] = Field(None, description="Type de module (text ou video)")

class ModuleRead(BaseModel):
    id: int
    title: str
    content: str
    type: ModuleType
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True

class ModuleList(BaseModel):
    """Schéma pour la liste paginée des modules"""
    id: int
    title: str
    type: ModuleType
    created_at: datetime

    class Config:
        from_attributes = True 