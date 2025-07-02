from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List
from db import get_db
from models import Course, Lesson
from models.user import User
from schemas.course import CourseCreate, CourseUpdate, CourseRead, CourseList
from schemas.lesson import LessonCreate, LessonUpdate, LessonRead, LessonList
from routers.dependencies import get_current_user, get_current_instructor_or_admin

router = APIRouter()

# === COURS ENDPOINTS ===

@router.get("/courses", response_model=List[CourseList])
def get_courses(
    skip: int = Query(0, ge=0, description="Nombre d'éléments à ignorer"),
    limit: int = Query(10, ge=1, le=100, description="Nombre maximum d'éléments à retourner"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Récupérer la liste paginée des cours"""
    courses = db.query(Course).offset(skip).limit(limit).all()
    return courses

@router.get("/courses/{course_id}", response_model=CourseRead)
def get_course(
    course_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Récupérer un cours par son ID"""
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found"
        )
    return course

@router.post("/courses", response_model=CourseRead, status_code=status.HTTP_201_CREATED)
def create_course(
    course: CourseCreate,
    db: Session = Depends(get_db),
    current_instructor: User = Depends(get_current_instructor_or_admin)
):
    """Créer un nouveau cours (instructeur ou admin uniquement)"""
    db_course = Course(
        title=course.title,
        description=course.description,
        level=course.level
    )
    db.add(db_course)
    db.commit()
    db.refresh(db_course)
    return db_course

@router.put("/courses/{course_id}", response_model=CourseRead)
def update_course(
    course_id: int,
    course_update: CourseUpdate,
    db: Session = Depends(get_db),
    current_instructor: User = Depends(get_current_instructor_or_admin)
):
    """Mettre à jour un cours (instructeur ou admin uniquement)"""
    # Vérifier que le cours existe
    db_course = db.query(Course).filter(Course.id == course_id).first()
    if not db_course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found"
        )
    
    # Mettre à jour les champs fournis
    update_data = course_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_course, field, value)
    
    db.commit()
    db.refresh(db_course)
    return db_course

@router.delete("/courses/{course_id}")
def delete_course(
    course_id: int,
    db: Session = Depends(get_db),
    current_instructor: User = Depends(get_current_instructor_or_admin)
):
    """Supprimer un cours (instructeur ou admin uniquement)"""
    # Vérifier que le cours existe
    db_course = db.query(Course).filter(Course.id == course_id).first()
    if not db_course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found"
        )
    
    db.delete(db_course)
    db.commit()
    
    return {"message": "Course deleted successfully"}

# === LESSONS ENDPOINTS ===

@router.get("/courses/{course_id}/lessons", response_model=List[LessonList])
def get_course_lessons(
    course_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Récupérer toutes les leçons d'un cours"""
    # Vérifier que le cours existe
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found"
        )
    
    lessons = db.query(Lesson).filter(Lesson.course_id == course_id).order_by(Lesson.order_index).all()
    return lessons

@router.get("/lessons/{lesson_id}", response_model=LessonRead)
def get_lesson(
    lesson_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Récupérer une leçon par son ID"""
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lesson not found"
        )
    return lesson

@router.post("/courses/{course_id}/lessons", response_model=LessonRead, status_code=status.HTTP_201_CREATED)
def create_lesson(
    course_id: int,
    lesson: LessonCreate,
    db: Session = Depends(get_db),
    current_instructor: User = Depends(get_current_instructor_or_admin)
):
    """Créer une nouvelle leçon pour un cours (instructeur ou admin uniquement)"""
    # Vérifier que le cours existe
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found"
        )
    
    # Vérifier que le course_id dans le body correspond au paramètre
    if lesson.course_id != course_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Course ID in URL and body must match"
        )
    
    db_lesson = Lesson(
        course_id=lesson.course_id,
        title=lesson.title,
        content=lesson.content,
        order_index=lesson.order_index
    )
    db.add(db_lesson)
    db.commit()
    db.refresh(db_lesson)
    return db_lesson

@router.put("/lessons/{lesson_id}", response_model=LessonRead)
def update_lesson(
    lesson_id: int,
    lesson_update: LessonUpdate,
    db: Session = Depends(get_db),
    current_instructor: User = Depends(get_current_instructor_or_admin)
):
    """Mettre à jour une leçon (instructeur ou admin uniquement)"""
    # Vérifier que la leçon existe
    db_lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not db_lesson:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lesson not found"
        )
    
    # Mettre à jour les champs fournis
    update_data = lesson_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_lesson, field, value)
    
    db.commit()
    db.refresh(db_lesson)
    return db_lesson

@router.delete("/lessons/{lesson_id}")
def delete_lesson(
    lesson_id: int,
    db: Session = Depends(get_db),
    current_instructor: User = Depends(get_current_instructor_or_admin)
):
    """Supprimer une leçon (instructeur ou admin uniquement)"""
    # Vérifier que la leçon existe
    db_lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not db_lesson:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lesson not found"
        )
    
    db.delete(db_lesson)
    db.commit()
    
    return {"message": "Lesson deleted successfully"} 