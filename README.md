# SpendWise - Financial Dashboard

En fullstack-applikation för att hålla koll på utgifter, kategorisera transaktioner och visualisera ekonomin i realtid. Jag byggde det här projektet för att få ihop en komplett flödeskedja från databas till frontend med moderna verktyg.

## Teknisk lösning

Projektet körs i containers via Docker för att det ska gå smidigt att starta upp oavsett miljö.

- **Frontend:** React, Chart.js, CSS
- **Backend:** Python, FastAPI, Pydantic, Uvicorn
- **Databas:** PostgreSQL, SQLAlchemy
- **Infrastruktur:** Docker, Docker Compose

## Funktioner

- **CRUD:** Lägg till, visa och ta bort transaktioner direkt i gränssnittet.
- **Visualisering:** Cirkeldiagram som räknar om automatiskt beroende på valda kategorifilter.
- **Filter:** Sortera transaktionerna per kategori.
- **Felhantering:** Tydliga laddningsindikatorer och felmeddelanden om anropet mot API:et misslyckas.

## Kom igång lokalt

Det enda som behövs för att köra igång är att Docker är installerat på datorn.

1. Klona repot:
   ```bash
   git clone [https://github.com/Lilooo73/spendwise.git](https://github.com/Lilooo73/spendwise.git)
   cd spendwise