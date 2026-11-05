# SpendWise - Financial Dashboard

En fullstack-applikation för att hålla koll på utgifter, kategorisera transaktioner och visualisera ekonomin i realtid. Jag byggde det här projektet för att få ihop en komplett flödeskedja från databas till frontend med moderna verktyg.

## Features

- **CRUD:** Lägg till, visa och ta bort transaktioner direkt i gränssnittet.
- **Visualisering:** Cirkeldiagram som räknar om automatiskt beroende på valda kategorifilter.
- **Filter:** Sortera transaktionerna per kategori.
- **Felhantering:** Tydliga laddningsindikatorer och felmeddelanden om anropet mot API:et misslyckas.

## Tech Stack

- **Frontend:** React, Chart.js, CSS
- **Backend:** Python, FastAPI, Pydantic, Uvicorn
- **Databas:** PostgreSQL, SQLAlchemy
- **Infrastruktur:** Docker, Docker Compose

## How to Run the App

1. Clone the repository

git clone https://github.com/Lilooo73/spendwise.git cd spendwise

2. Start with Docker Compose

docker compose up --build

3. Open in browser

Frontend: http://localhost:5173
API Docs: http://localhost:8000/docs