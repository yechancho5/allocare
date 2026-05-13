from pydantic import BaseModel


class EducationModule(BaseModel):
    id: str
    title: str
    description: str
    difficulty: str
    estimated_minutes: int
