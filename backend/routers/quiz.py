from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from db import get_db
from models.quiz import Quiz, Question, Choice
from models.module import CourseModule
from schemas.quiz import (
    QuizCreate, QuizRead, QuizUpdate, QuizSubmission, QuizResult, 
    QuestionResult, QuestionReadWithAnswers
)
from routers.dependencies import get_current_user
from models.user import User

router = APIRouter()


@router.get("/modules/{module_id}/quiz", response_model=QuizRead)
def get_quiz_by_module(
    module_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Récupérer le quiz d'un module"""
    
    # Vérifier que le module existe
    module = db.query(CourseModule).filter(CourseModule.id == module_id).first()
    if not module:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Module non trouvé"
        )
    
    # Récupérer le quiz avec ses questions et choix
    quiz = db.query(Quiz).filter(Quiz.module_id == module_id).first()
    if not quiz:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Aucun quiz trouvé pour ce module"
        )
    
    return quiz


@router.post("/modules/{module_id}/quiz", response_model=QuizRead)
def create_quiz(
    module_id: int,
    quiz_data: QuizCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Créer un quiz pour un module (instructeur/admin seulement)"""
    
    # Vérifier les permissions
    if current_user.role not in ["instructor", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Seuls les instructeurs et administrateurs peuvent créer des quiz"
        )
    
    # Vérifier que le module existe
    module = db.query(CourseModule).filter(CourseModule.id == module_id).first()
    if not module:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Module non trouvé"
        )
    
    # Vérifier qu'il n'y a pas déjà un quiz pour ce module
    existing_quiz = db.query(Quiz).filter(Quiz.module_id == module_id).first()
    if existing_quiz:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Un quiz existe déjà pour ce module"
        )
    
    # Créer le quiz
    quiz = Quiz(module_id=module_id, title=quiz_data.title)
    db.add(quiz)
    db.flush()  # Pour obtenir l'ID du quiz
    
    # Créer les questions et choix
    for q_order, question_data in enumerate(quiz_data.questions):
        question = Question(
            quiz_id=quiz.id,
            text=question_data.text,
            order=question_data.order or q_order
        )
        db.add(question)
        db.flush()  # Pour obtenir l'ID de la question
        
        # Créer les choix
        for c_order, choice_data in enumerate(question_data.choices):
            choice = Choice(
                question_id=question.id,
                text=choice_data.text,
                is_correct=choice_data.is_correct,
                order=choice_data.order or c_order
            )
            db.add(choice)
    
    db.commit()
    db.refresh(quiz)
    return quiz


@router.post("/modules/{module_id}/quiz/submit", response_model=QuizResult)
def submit_quiz(
    module_id: int,
    submission: QuizSubmission,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Soumettre les réponses d'un quiz et calculer le score"""
    
    # Récupérer le quiz avec ses questions et choix
    quiz = db.query(Quiz).filter(Quiz.module_id == module_id).first()
    if not quiz:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Aucun quiz trouvé pour ce module"
        )
    
    # Créer un dictionnaire des réponses soumises
    submitted_answers = {answer.question_id: answer.choice_id for answer in submission.answers}
    
    # Calculer le score et préparer les détails
    total_questions = len(quiz.questions)
    correct_answers = 0
    details = []
    
    for question in quiz.questions:
        # Trouver la bonne réponse
        correct_choice = next((choice for choice in question.choices if choice.is_correct), None)
        if not correct_choice:
            continue  # Ignorer les questions sans bonne réponse
        
        # Récupérer la réponse de l'utilisateur
        selected_choice_id = submitted_answers.get(question.id)
        selected_choice = None
        
        if selected_choice_id:
            selected_choice = next(
                (choice for choice in question.choices if choice.id == selected_choice_id), 
                None
            )
        
        # Si aucune réponse sélectionnée, considérer comme incorrecte
        if not selected_choice:
            details.append(QuestionResult(
                question_id=question.id,
                question_text=question.text,
                selected_choice_id=0,
                selected_choice_text="Aucune réponse",
                correct_choice_id=correct_choice.id,
                correct_choice_text=correct_choice.text,
                is_correct=False
            ))
            continue
        
        # Vérifier si la réponse est correcte
        is_correct = selected_choice.is_correct
        if is_correct:
            correct_answers += 1
        
        details.append(QuestionResult(
            question_id=question.id,
            question_text=question.text,
            selected_choice_id=selected_choice.id,
            selected_choice_text=selected_choice.text,
            correct_choice_id=correct_choice.id,
            correct_choice_text=correct_choice.text,
            is_correct=is_correct
        ))
    
    # Calculer le pourcentage
    score_percentage = (correct_answers / total_questions * 100) if total_questions > 0 else 0
    
    return QuizResult(
        total=total_questions,
        correct=correct_answers,
        score_percentage=round(score_percentage, 2),
        details=details
    )


@router.put("/modules/{module_id}/quiz", response_model=QuizRead)
def update_quiz(
    module_id: int,
    quiz_data: QuizUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Mettre à jour un quiz (instructeur/admin seulement)"""
    
    # Vérifier les permissions
    if current_user.role not in ["instructor", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Seuls les instructeurs et administrateurs peuvent modifier des quiz"
        )
    
    # Récupérer le quiz existant
    quiz = db.query(Quiz).filter(Quiz.module_id == module_id).first()
    if not quiz:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Aucun quiz trouvé pour ce module"
        )
    
    # Mettre à jour le titre si fourni
    if quiz_data.title is not None:
        quiz.title = quiz_data.title
    
    # Mettre à jour les questions si fournies
    if quiz_data.questions is not None:
        # Supprimer les anciennes questions (cascade supprimera les choix)
        db.query(Question).filter(Question.quiz_id == quiz.id).delete()
        
        # Créer les nouvelles questions
        for q_order, question_data in enumerate(quiz_data.questions):
            question = Question(
                quiz_id=quiz.id,
                text=question_data.text,
                order=question_data.order or q_order
            )
            db.add(question)
            db.flush()
            
            # Créer les choix
            for c_order, choice_data in enumerate(question_data.choices):
                choice = Choice(
                    question_id=question.id,
                    text=choice_data.text,
                    is_correct=choice_data.is_correct,
                    order=choice_data.order or c_order
                )
                db.add(choice)
    
    db.commit()
    db.refresh(quiz)
    return quiz


@router.delete("/modules/{module_id}/quiz")
def delete_quiz(
    module_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Supprimer un quiz (instructeur/admin seulement)"""
    
    # Vérifier les permissions
    if current_user.role not in ["instructor", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Seuls les instructeurs et administrateurs peuvent supprimer des quiz"
        )
    
    # Récupérer le quiz
    quiz = db.query(Quiz).filter(Quiz.module_id == module_id).first()
    if not quiz:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Aucun quiz trouvé pour ce module"
        )
    
    db.delete(quiz)
    db.commit()
    
    return {"message": "Quiz supprimé avec succès"}


@router.get("/modules/{module_id}/quiz/answers", response_model=List[QuestionReadWithAnswers])
def get_quiz_with_answers(
    module_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Récupérer le quiz avec les bonnes réponses (instructeur/admin seulement)"""
    
    # Vérifier les permissions
    if current_user.role not in ["instructor", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Seuls les instructeurs et administrateurs peuvent voir les réponses"
        )
    
    # Récupérer le quiz
    quiz = db.query(Quiz).filter(Quiz.module_id == module_id).first()
    if not quiz:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Aucun quiz trouvé pour ce module"
        )
    
    return quiz.questions 