# Generated Application — Spring Boot REST API

Generated from RNC UIR. Standalone REST API (Spring Boot 3 + Spring Data JPA), database: **postgresql**.

## Run
```bash
docker compose up --build        # api + database
# or, against a running database:
./gradlew bootRun
```
API on `http://localhost:8080`. Interactive docs at `http://localhost:8080/swagger-ui.html`
(live OpenAPI JSON at `/v3/api-docs`). The `docs/openapi.yaml` file is the design contract.
