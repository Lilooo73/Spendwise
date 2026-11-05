from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine
from . import models
from .routers import transactions, analytics, auth

# Skapar tabellerna i PostgreSQL baserat på våra modeller
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="SpendWise API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # I produktion sätter du specifik domän
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Här Registrera routern för transaktioner
app.include_router(transactions.router, prefix="/transactions", tags=["transactions"])
app.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
app.include_router(auth.router, prefix="/auth", tags=["auth"])

@app.get("/")
def read_root():
    return {"message": "Välkommen till SpendWise API!"}