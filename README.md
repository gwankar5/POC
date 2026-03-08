
# Treasure Hunt – Full Stack Engineering POC

A full-stack implementation of a **Treasure Hunt puzzle game** built using **Spring Boot (Backend)** and **React + TypeScript (Frontend)**.

This project demonstrates session‑based gameplay, proximity‑based treasure detection logic, and leaderboard tracking.

---

# Overview

Players attempt to locate **3 hidden treasures on a 5×5 board**.

Each turn a player can reveal **1–3 cells simultaneously**.  
If a cell does not contain a treasure, the backend returns a **proximity clue**.

The objective is to **find all treasures in the fewest turns possible**, after which the player's score is stored in the **Top 10 leaderboard**.

---

# Technology Stack

## Backend
- Java 17+
- Spring Boot
- REST APIs
- Maven
- Swagger (OpenAPI)

## Frontend
- React
- TypeScript
- Vite
- React Router

## Tools
- Git
- GitHub
- VS Code / IntelliJ

---

# Game Rules

| Rule | Description |
|-----|-------------|
| Board | 5×5 grid |
| Treasures | 3 hidden treasures |
| Turn | Player may reveal **1–3 cells per turn** |
| Game End | When all treasures are found |
| Score | Number of turns taken |
| Leaderboard | Top 10 scores stored in backend |

---

# Proximity Clues

| Value | Meaning |
|------|--------|
| **3** | Closest proximity to treasure |
| **2** | Diagonal proximity |
| **1** | Outer clue ring |
| **💎** | Treasure found |

Example board when fully revealed:

3  T  3  2  1  
2  3  2  3  2  
1  2  3  T  3  
2  3  2  3  2  
3  T  3  2  1  

T = Treasure

---

# Architecture

Frontend (React + Vite)  
        │  
        │ REST API  
        ▼  
Backend (Spring Boot)  
        │  
        ▼  
Game Engine + Session Manager + Leaderboard

---

# API Endpoints

## Create Player

POST /api/v1/players

Request

{
"name": "PlayerName"
}

Response

{
"sessionToken": "abc123"
}

---

## Get Current Game

GET /api/v1/game/current

Header

Authorization: Bearer <sessionToken>

---

## Reveal Cells

POST /api/v1/game/reveal

Request

{
"positions": [
{"row":1,"col":2},
{"row":2,"col":3}
]
}

Response includes proximity clues and treasure discoveries.

---

## Leaderboard

GET /api/v1/scores/top10

Returns top 10 scores.

---

# Project Structure

Treasure-Hunt-POC

backend  
  src  
  pom.xml  

frontend  
  src  
  package.json  

README.md

---

# Running the Application

## Backend

cd backend  
mvn spring-boot:run

Swagger

http://localhost:8080/swagger-ui/index.html

---

## Frontend

cd frontend  
npm install  
npm run dev

Frontend runs at

http://localhost:5173

---

# Environment Configuration

frontend/.env.local

VITE_API_BASE_URL=http://localhost:8080/api/v1

---

# Gameplay Flow

1. Player enters name
2. Session is created
3. Game board loads
4. Player selects cells
5. Backend evaluates reveal
6. Treasures discovered
7. Game ends
8. Score added to leaderboard

---

# Software Quality

Designed considering principles inspired by **ISO/IEC 25000**:

Maintainability – modular architecture  
Reliability – backend validation of moves  
Usability – simple and responsive UI  
Performance – minimal API payloads

---

# Possible Enhancements

- Database persistence (PostgreSQL)
- Multiplayer mode
- Authentication
- Docker deployment
- Cloud hosting (AWS / Azure)
- WebSocket realtime gameplay

---

# Author

Gaurav Wankar

Senior Software Engineer  
Java • Spring Boot • System Design

---

# License

Educational / demonstration purposes.
