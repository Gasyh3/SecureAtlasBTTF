from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


# Schemas pour les choix
class ChoiceCreate(BaseModel):
    text: str
    is_correct: bool
    order: Optional[int] = 0


class ChoiceRead(BaseModel):
    id: int
    text: str
    order: Optional[int] = 0
    
    class Config:
        from_attributes = True


class ChoiceReadWithAnswer(BaseModel):
    id: int
    text: str
    is_correct: bool
    order: Optional[int] = 0
    
    class Config:
        from_attributes = True


# Schemas pour les questions
class QuestionCreate(BaseModel):
    text: str
    order: Optional[int] = 0
    choices: List[ChoiceCreate]


class QuestionRead(BaseModel):
    id: int
    text: str
    order: Optional[int] = 0
    choices: List[ChoiceRead]
    
    class Config:
        from_attributes = True


class QuestionReadWithAnswers(BaseModel):
    id: int
    text: str
    order: Optional[int] = 0
    choices: List[ChoiceReadWithAnswer]
    
    class Config:
        from_attributes = True


# Schemas pour les quiz
class QuizCreate(BaseModel):
    title: str
    questions: List[QuestionCreate]


class QuizRead(BaseModel):
    id: int
    title: str
    module_id: int
    questions: List[QuestionRead]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# Schemas pour les soumissions et résultats
class Answer(BaseModel):
    question_id: int
    choice_id: int


class QuizSubmission(BaseModel):
    answers: List[Answer]


class QuestionResult(BaseModel):
    question_id: int
    question_text: str
    selected_choice_id: int
    selected_choice_text: str
    correct_choice_id: int
    correct_choice_text: str
    is_correct: bool


class QuizResult(BaseModel):
    total: int
    correct: int
    score_percentage: float
    details: List[QuestionResult]


# Schemas pour la mise à jour
class QuizUpdate(BaseModel):
    title: Optional[str] = None
    questions: Optional[List[QuestionCreate]] = None 