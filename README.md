 Salon & Barber Appointment Booking System

# Description
A web based Salon & Barber Appointment Booking System developed using React, Vite, Tailwind CSS, Spring Boot, Spring Data JPA, and PostgreSQL.

# Technologies Used
- React
- Vite
- Tailwind CSS
- Spring Boot
- Spring Data JPA
- PostgreSQL

# Features
- User Registration and Login
- Appointment Booking
- Appointment Management
- Customer Management
- Staff Management
- Admin Dashboard

## Run with Docker

Prerequisite: Docker Desktop (or Docker Engine with Compose) must be running.

```bash
docker compose up --build
```

Open the app at http://localhost. The API is available at http://localhost:8080 and PostgreSQL is exposed on port 5432 for local database tools.

To use a non-default local database password, set `POSTGRES_PASSWORD` before starting Compose. Persistent database data is stored in the `postgres_data` Docker volume. Stop the stack with `docker compose down`; add `-v` only when you intentionally want to remove the database volume.
