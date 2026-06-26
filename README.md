# Generated Application — Next.js + Spring Boot

Generated from RNC UIR. Decoupled architecture: a Next.js frontend (shadcn/ui) talking to a
standalone Spring Boot 3 + Spring Data JPA REST API. Database: **postgresql**.

## Run with Docker (recommended)
```bash
docker compose up --build
```
Host ports are offset so they don't clash with other local microservices:

| Service        | URL / Port                                |
|----------------|-------------------------------------------|
| Frontend       | http://localhost:3025                     |
| API            | http://localhost:38080                    |
| API docs       | http://localhost:38080/swagger-ui.html    |
| Database (postgresql)  | localhost:35432                              |

Open **http://localhost:3025** in the browser. The frontend reaches the API through its own
server-side proxy (`/api/*` → Spring), so the browser only ever talks to the frontend.
Live OpenAPI JSON: `http://localhost:38080/v3/api-docs`. Design contract: `docs/openapi.yaml`.

## Local dev (no Docker)
```bash
./gradlew bootRun                              # API on :8080 (needs a running database)
cd frontend && npm install && npm run dev      # frontend on :3000
```
