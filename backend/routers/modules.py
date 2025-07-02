from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List
from db import get_db
from models.module import CourseModule
from models.user import User
from schemas.module import ModuleCreate, ModuleUpdate, ModuleRead, ModuleList
from routers.dependencies import get_current_user, get_current_instructor_or_admin

router = APIRouter()

@router.get("/", response_model=List[ModuleList])
def get_modules(
    skip: int = Query(0, ge=0, description="Nombre d'éléments à ignorer"),
    limit: int = Query(10, ge=1, le=100, description="Nombre maximum d'éléments à retourner"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Récupérer la liste paginée des modules"""
    modules = db.query(CourseModule).offset(skip).limit(limit).all()
    return modules

@router.get("/{module_id}", response_model=ModuleRead)
def get_module(
    module_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Récupérer un module par son ID"""
    module = db.query(CourseModule).filter(CourseModule.id == module_id).first()
    if not module:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Module not found"
        )
    return module

@router.post("/", response_model=ModuleRead, status_code=status.HTTP_201_CREATED)
def create_module(
    module: ModuleCreate,
    db: Session = Depends(get_db),
    current_instructor: User = Depends(get_current_instructor_or_admin)
):
    """Créer un nouveau module (instructeur ou admin uniquement)"""
    db_module = CourseModule(
        title=module.title,
        content=module.content,
        type=module.type
    )
    db.add(db_module)
    db.commit()
    db.refresh(db_module)
    return db_module

@router.put("/{module_id}", response_model=ModuleRead)
def update_module(
    module_id: int,
    module_update: ModuleUpdate,
    db: Session = Depends(get_db),
    current_instructor: User = Depends(get_current_instructor_or_admin)
):
    """Mettre à jour un module (instructeur ou admin uniquement)"""
    # Vérifier que le module existe
    db_module = db.query(CourseModule).filter(CourseModule.id == module_id).first()
    if not db_module:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Module not found"
        )
    
    # Mettre à jour les champs fournis
    update_data = module_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_module, field, value)
    
    db.commit()
    db.refresh(db_module)
    return db_module

@router.delete("/{module_id}")
def delete_module(
    module_id: int,
    db: Session = Depends(get_db),
    current_instructor: User = Depends(get_current_instructor_or_admin)
):
    """Supprimer un module (instructeur ou admin uniquement)"""
    # Vérifier que le module existe
    db_module = db.query(CourseModule).filter(CourseModule.id == module_id).first()
    if not db_module:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Module not found"
        )
    
    db.delete(db_module)
    db.commit()
    
    return {"message": "Module deleted successfully"}

@router.get("/stats/count")
def get_modules_count(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Récupérer le nombre total de modules"""
    total_modules = db.query(CourseModule).count()
    return {"total_modules": total_modules} 