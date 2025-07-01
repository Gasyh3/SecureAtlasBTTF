from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional
from models.user import RoleEnum

class UserCreate(BaseModel):
    username: Optional[str] = Field(None, max_length=50, description="Nom d'utilisateur unique")
    email: EmailStr
    firstname: Optional[str] = Field(None, max_length=100, description="Prénom")
    lastname: Optional[str] = Field(None, max_length=100, description="Nom de famille")
    picture_profile: Optional[str] = Field(None, max_length=500, description="URL de la photo de profil")
    password: str = Field(..., min_length=6, description="Mot de passe (minimum 6 caractères)")

class UserUpdate(BaseModel):
    username: Optional[str] = Field(None, max_length=50, description="Nom d'utilisateur unique")
    firstname: Optional[str] = Field(None, max_length=100, description="Prénom")
    lastname: Optional[str] = Field(None, max_length=100, description="Nom de famille")
    picture_profile: Optional[str] = Field(None, max_length=500, description="URL de la photo de profil")

class UserRead(BaseModel):
    id: int
    username: Optional[str]
    email: str
    firstname: Optional[str]
    lastname: Optional[str]
    picture_profile: Optional[str]
    role: RoleEnum
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class UserPublic(BaseModel):
    """Schéma pour afficher les informations publiques d'un utilisateur"""
    id: int
    username: Optional[str]
    firstname: Optional[str]
    lastname: Optional[str]
    picture_profile: Optional[str]
    role: RoleEnum

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: str | None = None 