from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

# Scheman för Användare
class UserCreate(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    created_at: datetime

    class Config:
        from_attributes = True

# Scheman för Transaktioner
class TransactionCreate(BaseModel):
    title: str
    amount: float
    category: str

class TransactionResponse(BaseModel):
    id: int
    title: str
    amount: float
    category: str
    date: Optional[datetime] = None
    owner_id: Optional[int] = None

    class Config:
        from_attributes = True

class CategorySummaryResponse(BaseModel):
    category: str
    total_amount: float

    class Config:
        from_attributes = True

class MonthlySummaryResponse(BaseModel):
    month: str
    total_amount: float

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str