from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

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

@app.get("/")
async def root():
    return {"message": "Bienvenue sur la plateforme d'e-learning adaptatif"}

@app.get("/health")
async def health_check():
    return {"status": "ok"}

@app.get("/api/courses")
async def get_courses():
    # Placeholder pour les cours
    return {
        "courses": [
            {"id": 1, "title": "Introduction à Python", "level": "beginner"},
            {"id": 2, "title": "Développement Web avec FastAPI", "level": "intermediate"}
        ]
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000) 