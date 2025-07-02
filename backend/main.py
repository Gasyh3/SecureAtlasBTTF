from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import uvicorn
from db import get_db, engine, Base
from routers import courses, auth, modules
# Import all models so SQLAlchemy can discover them
from models import User, Course, Lesson, Enrollment, CourseModule

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="E-Learning Platform API",
    description="API pour une plateforme d'e-learning adaptatif",
    version="1.0.0"
)

# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(courses.router, prefix="/api", tags=["courses"])
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(modules.router, prefix="/api/modules", tags=["modules"])

@app.get("/")
async def root():
    return {"message": "Bienvenue sur la plateforme d'e-learning adaptatif"}

@app.get("/health")
async def health_check(db: Session = Depends(get_db)):
    try:
        db.execute("SELECT 1")
        return {"status": "ok", "database": "connected"}
    except Exception:
        return {"status": "ok", "database": "disconnected"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000) 