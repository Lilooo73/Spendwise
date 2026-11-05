from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas
from ..database import get_db

router = APIRouter(
    tags=["Transactions"]
)

@router.post("/", response_model=schemas.TransactionResponse)
def create_transaction(
    transaction: schemas.TransactionCreate, 
    db: Session = Depends(get_db)
):
    db_transaction = models.Transaction(
        **transaction.model_dump()
    )
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction

@router.get("/", response_model=List[schemas.TransactionResponse])
def get_transactions(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db)
):
    transactions = (
        db.query(models.Transaction)
        .offset(skip)
        .limit(limit)
        .all()
    )
    return transactions

@router.delete("/{transaction_id}")
def delete_transaction(transaction_id: int, db: Session = Depends(get_db)):
    db_txn = db.query(models.Transaction).filter(models.Transaction.id == transaction_id).first()
    if not db_txn:
        raise HTTPException(status_code=404, detail="Transaction not found")
    db.delete(db_txn)
    db.commit()
    return {"ok": True}