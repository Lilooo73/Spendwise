from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from .. import models, schemas
from ..database import get_db
from ..auth import hash_password, verify_password, create_access_token, get_current_user

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

@router.post("/register", response_model=schemas.UserResponse)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # Kontrollera om e-postadressen redan finns
    existing_user = db.query(models.User).filter(models.User.email == user.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="E-postadressen är redan registrerad"
        )
    
    # Hasha lösenordet och spara användaren
    hashed_pwd = hash_password(user.password)
    new_user = models.User(email=user.email, hashed_password=hashed_pwd)
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/login", response_model=schemas.Token)
def login_user(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # Hitta användaren i databasen via form_data.username (e-post)
    db_user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not db_user or not verify_password(form_data.password, db_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Felaktig e-post eller lösenord",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Skapa en JWT-token som gäller i 30 minuter
    access_token = create_access_token(data={"sub": db_user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me")
def read_users_me(current_user: models.User = Depends(get_current_user)):
    return {"email": current_user.email, "id": current_user.id}