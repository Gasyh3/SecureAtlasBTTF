from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from core.security import get_password_hash, verify_password, create_access_token
from db import get_db
from models.user import User, RoleEnum
from schemas.user import UserCreate, UserCreateAdmin, UserRead, UserUpdate, UserPublic, Token
from routers.dependencies import get_current_user, get_current_admin

router = APIRouter()

@router.post("/register", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def register(user: UserCreate, db: Session = Depends(get_db)):
    # Vérifier si l'email existe déjà
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Vérifier si le username existe déjà (si fourni)
    if user.username:
        db_user_username = db.query(User).filter(User.username == user.username).first()
        if db_user_username:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already taken"
            )
    
    # Créer le nouvel utilisateur avec tous les champs
    hashed_password = get_password_hash(user.password)
    db_user = User(
        username=user.username,
        email=user.email,
        firstname=user.firstname,
        lastname=user.lastname,
        picture_profile=user.picture_profile,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return db_user

@router.post("/register-admin", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def register_admin(
    user: UserCreateAdmin, 
    db: Session = Depends(get_db), 
    current_admin: User = Depends(get_current_admin)
):
    """Créer un utilisateur avec un rôle spécifique (admin uniquement)"""
    
    # Si on essaie de créer un admin, vérifier qu'il n'y en a pas déjà un
    if user.role == RoleEnum.admin:
        existing_admin = db.query(User).filter(User.role == RoleEnum.admin).first()
        if existing_admin:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="An admin user already exists. Only one admin is allowed."
            )
    
    # Vérifier si l'email existe déjà
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Vérifier si le username existe déjà (si fourni)
    if user.username:
        db_user_username = db.query(User).filter(User.username == user.username).first()
        if db_user_username:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already taken"
            )
    
    # Créer le nouvel utilisateur avec le rôle spécifié
    hashed_password = get_password_hash(user.password)
    db_user = User(
        username=user.username,
        email=user.email,
        firstname=user.firstname,
        lastname=user.lastname,
        picture_profile=user.picture_profile,
        hashed_password=hashed_password,
        role=user.role
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return db_user

@router.post("/create-first-admin", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def create_first_admin(user: UserCreateAdmin, db: Session = Depends(get_db)):
    """Créer le premier admin - endpoint sans authentification"""
    
    # Vérifier qu'il n'y a aucun admin existant
    existing_admin = db.query(User).filter(User.role == RoleEnum.admin).first()
    if existing_admin:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An admin user already exists. Use /register-admin endpoint instead."
        )
    
    # Forcer le rôle admin
    if user.role != RoleEnum.admin:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This endpoint is only for creating admin users."
        )
    
    # Vérifier si l'email existe déjà
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Vérifier si le username existe déjà (si fourni)
    if user.username:
        db_user_username = db.query(User).filter(User.username == user.username).first()
        if db_user_username:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already taken"
            )
    
    # Créer le premier admin
    hashed_password = get_password_hash(user.password)
    db_user = User(
        username=user.username,
        email=user.email,
        firstname=user.firstname,
        lastname=user.lastname,
        picture_profile=user.picture_profile,
        hashed_password=hashed_password,
        role=RoleEnum.admin
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return db_user

@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # Vérifier les identifiants (support email ou username)
    user = db.query(User).filter(
        (User.email == form_data.username) | (User.username == form_data.username)
    ).first()
    
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email/username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Créer le token d'accès
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserRead)
def get_current_user_profile(current_user: User = Depends(get_current_user)):
    """Récupérer le profil de l'utilisateur connecté"""
    return current_user

@router.put("/me", response_model=UserRead)
def update_current_user_profile(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Mettre à jour le profil de l'utilisateur connecté"""
    
    # Vérifier l'unicité du username si modifié
    if user_update.username and user_update.username != current_user.username:
        existing_user = db.query(User).filter(User.username == user_update.username).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already taken"
            )
    
    # Mettre à jour les champs fournis
    update_data = user_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(current_user, field, value)
    
    db.commit()
    db.refresh(current_user)
    
    return current_user

@router.get("/users/{user_id}", response_model=UserPublic)
def get_user_public_profile(user_id: int, db: Session = Depends(get_db)):
    """Récupérer le profil public d'un utilisateur"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user

# Endpoints admin uniquement
@router.get("/admin/users", response_model=list[UserRead])
def get_all_users(
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Récupérer tous les utilisateurs (admin uniquement)"""
    users = db.query(User).all()
    return users

@router.delete("/admin/users/{user_id}")
def delete_user(
    user_id: int,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Supprimer un utilisateur (admin uniquement)"""
    # Vérifier que l'utilisateur existe
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Empêcher la suppression du dernier admin
    if user.role == RoleEnum.admin:
        admin_count = db.query(User).filter(User.role == RoleEnum.admin).count()
        if admin_count <= 1:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot delete the last admin user"
            )
    
    db.delete(user)
    db.commit()
    
    return {"message": "User deleted successfully"}

@router.put("/admin/users/{user_id}/role", response_model=UserRead)
def update_user_role(
    user_id: int,
    new_role: RoleEnum,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Changer le rôle d'un utilisateur (admin uniquement)"""
    # Vérifier que l'utilisateur existe
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Si on essaie de promouvoir quelqu'un admin, vérifier qu'il n'y en a pas déjà un
    if new_role == RoleEnum.admin and user.role != RoleEnum.admin:
        existing_admin = db.query(User).filter(User.role == RoleEnum.admin).first()
        if existing_admin:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="An admin user already exists. Only one admin is allowed."
            )
    
    # Empêcher la rétrogradation du dernier admin
    if user.role == RoleEnum.admin and new_role != RoleEnum.admin:
        admin_count = db.query(User).filter(User.role == RoleEnum.admin).count()
        if admin_count <= 1:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot demote the last admin user"
            )
    
    user.role = new_role
    db.commit()
    db.refresh(user)
    
    return user 