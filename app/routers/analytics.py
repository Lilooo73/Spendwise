from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from .. import models, schemas
from ..database import get_db

router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"]
)

@router.get("/category-summary", response_model=List[schemas.CategorySummaryResponse])
def get_category_summary(db: Session = Depends(get_db)):
    # Utför en gruppering och summering per kategori i databasen
    results = db.query(
        models.Transaction.category,
        func.sum(models.Transaction.amount).label("total_amount")
    ).group_by(models.Transaction.category).all()

    # Omvandla resultatet till en lista med dictionaries som matchar Pydantic-schemat
    summary = [{"category": row.category, "total_amount": row.total_amount} for row in results]
    return summary

@router.get("/monthly-summary", response_model=List[schemas.MonthlySummaryResponse])
def get_monthly_summary(db: Session = Depends(get_db)):
    # Grupperar och summerar transaktioner per år och månad
    results = db.query(
        func.to_char(models.Transaction.date, 'YYYY-MM').label("month"),
        func.sum(models.Transaction.amount).label("total_amount")
    ).group_by(
        func.to_char(models.Transaction.date, 'YYYY-MM')
    ).order_by("month").all()

    summary = [{"month": row.month, "total_amount": row.total_amount} for row in results]
    return summary