# Treasure Hunt POC

A complete proof of concept for the full-stack puzzle: React/Redux frontend + Spring Boot backend. The solution implements the required game rules: 5x5 board, 3 hidden treasures, up to 3 cell reveals per turn, proximity feedback, persistent revealed cells, resume by browser restart using a session token, and top-10 scores stored in backend memory. These requirements come directly from the supplied puzzle statement. fileciteturn2file0L10-L13 fileciteturn2file0L16-L29 fileciteturn2file0L32-L39

## Solution structure

- `backend/` — Spring Boot 3.4.6, Java 21, REST API, in-memory repositories
- `frontend/` — React + TypeScript + Redux Toolkit + Vite

## Architecture decisions

### 1. Modular monolith over microservices
For a POC with a single bounded context and in-memory state, a modular monolith is the correct engineering tradeoff. It reduces deployment complexity, improves debuggability, and preserves delivery speed. Microservices would add accidental complexity without improving the required outcome.

### 2. Backend-authoritative game state
Treasure coordinates are generated and held only in the backend. The frontend receives only revealed-cell results. This is necessary because the puzzle explicitly states the frontend should not receive treasure positions initially. fileciteturn2file0L22-L26

### 3. Session continuity without database
The puzzle explicitly allows no database and loss of state after backend restart. Resume after browser restart is achieved by storing the backend-issued session token in localStorage and reloading the current game from the backend. fileciteturn2file0L35-L39

### 4. Turn-based reveal contract
One API call can reveal 1 to 3 cells, and the entire batch counts as one turn. This is the cleanest interpretation of the stated rule that each turn allows up to 3 positions and that they should be checked in a single server call. fileciteturn2file0L19-L26

## ISO 25000 / ISO 25010 alignment

This design uses ISO/IEC 25010 quality characteristics from the ISO 25000 family as engineering quality gates.

- **Functional suitability**: all required rules are implemented server-side and covered by validation.
- **Reliability**: server-authoritative state, invalid-move rejection, thread-safe in-memory stores.
- **Usability**: simple 5x5 board, explicit selected-cell count, consistent revealed-state behavior.
- **Performance efficiency**: O(1) in-memory lookups, tiny payloads, no database latency.
- **Security**: opaque session token, request validation, treasure secrecy preserved.
- **Maintainability**: clean controller-service-domain split, DTO separation, small bounded logic.
- **Portability**: no infrastructure dependency, simple local startup, optional Dockerization can be added later.
- **Compatibility**: strict REST JSON contracts and CORS support for local frontend/backend separation.

## SDLC approach

A practical SDLC for this POC:

1. **Requirements analysis**
   - freeze the functional rules and acceptance criteria from the puzzle
   - define API contracts and session/resume strategy
2. **Architecture/design**
   - choose modular monolith, layered services, in-memory repositories
   - define domain model, error model, testing approach
3. **Implementation**
   - backend APIs and domain rules
   - frontend pages, state management, resume flow
4. **Verification**
   - unit tests, API integration tests, UI tests, exploratory verification
5. **Release readiness**
   - build instructions, known limitations, review checklist

## Backend APIs

### Create player / start game
`POST /api/v1/players`

### Resume current game
`GET /api/v1/game/current`
Header: `Authorization: Bearer <sessionToken>`

### Reveal up to 3 cells in one turn
`POST /api/v1/game/reveal`
Header: `Authorization: Bearer <sessionToken>`

### Top 10 scores
`GET /api/v1/scores/top10`

## Data and software quality controls

- player name trimmed and length-constrained
- board positions validated to 0..4
- duplicate positions rejected in the same turn
- already revealed cells rejected
- completed games blocked from further moves
- score recorded only at successful completion
- scores sorted deterministically by turns, then completion timestamp

## Build and run

### Backend
Requirements:
- Java 21
- Maven 3.9+

Run:
```bash
cd backend
mvn spring-boot:run
```

Backend starts on:
```text
http://localhost:8080
```

### Frontend
Requirements:
- Node 20+
- npm 10+

Run:
```bash
cd frontend
npm install
npm run dev
```

Frontend starts on:
```text
http://localhost:5173
```

## Testing

### Backend
```bash
cd backend
mvn test
```

### Recommended additional verification
- MockMvc tests for controllers
- React Testing Library tests for UI behavior
- Playwright E2E for resume flow and full game flow

## Known limitations of this POC

- backend restart clears state and scores by design, which is acceptable per puzzle constraints. fileciteturn2file0L39-L39
- no authentication beyond opaque session token because this is a POC, not a production security model
- styling is intentionally simple because the puzzle states graphical design is not evaluated. fileciteturn2file0L37-L38

## Production hardening path

For production, the next steps would be:
- persistent database for sessions and scores
- distributed cache if horizontally scaled
- JWT or server-side session management
- observability: metrics, tracing, structured logs
- CI quality gates: lint, tests, coverage, static analysis
- API documentation via OpenAPI
