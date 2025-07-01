from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db import get_db
from models import Course
from typing import List

router = APIRouter()

@router.get("/courses")
async def get_courses(db: Session = Depends(get_db)):
    courses = db.query(Course).all()
    if not courses:
        return {
            "courses": [
                {"id": 1, "title": "Introduction à Python", "level": "beginner"},
                {"id": 2, "title": "Développement Web avec FastAPI", "level": "intermediate"}
            ]
        }
    
    return {
        "courses": [
            {
                "id": course.id,
                "title": course.title,
                "description": course.description,
                "level": course.level.value if course.level else "beginner"
            }
            for course in courses
        ]
    }

@router.get("/courses/{course_id}")
async def get_course(course_id: int, db: Session = Depends(get_db)):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    return {
        "id": course.id,
        "title": course.title,
        "description": course.description,
        "level": course.level.value if course.level else "beginner"
    } 