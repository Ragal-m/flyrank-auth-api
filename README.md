# FlyRank Auth API

A secure Express API built by **Mahmoud Elragal** for FlyRank Backend Week 2,
Assignment A4. Supabase Auth manages accounts and passwords, while reusable
middleware verifies bearer JWTs before protected route handlers run.

## Features

- Sign up and log in through Supabase Auth
- Access and refresh tokens returned on successful login
- Strict `Authorization: Bearer <token>` parsing
- Server-side token verification with `supabase.auth.getUser(token)`
- Reusable auth middleware protecting profile, dashboard, and logout
- Interactive OpenAPI documentation with Swagger bearer authorization
- Automated tests covering success and rejection paths

## Prerequisites

- Node.js 20 or newer
- A free [Supabase](https://supabase.com/) project

For this practice project, disable email confirmation under **Authentication →
Sign In / Providers → Email** so a newly created account can log in immediately.
Do not use a `service_role` key.

## Setup

```bash
git clone https://github.com/Ragal-m/flyrank-auth-api.git
cd flyrank-auth-api
npm install
cp .env.example .env
```

Fill in `.env` with the project URL and **anon** key from the Supabase dashboard:

```dotenv
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
PORT=3000
```

Start the server:

```bash
npm start
```

Open Swagger UI at [http://localhost:3000/docs](http://localhost:3000/docs).

## API reference

| Method | Route | Authentication | Success |
| --- | --- | --- | --- |
| `POST` | `/auth/signup` | No | `201 Created` |
| `POST` | `/auth/login` | No | `200 OK` |
| `POST` | `/auth/logout` | Bearer JWT | `204 No Content` |
| `GET` | `/public/info` | No | `200 OK` |
| `GET` | `/protected/profile` | Bearer JWT | `200 OK` |
| `GET` | `/protected/dashboard` | Bearer JWT | `200 OK` |

Missing signup/login fields return `400`. Missing or malformed authorization
returns `401` with `{"error":"Access token required"}`. Invalid, tampered, or
expired JWTs return `401` with `{"error":"Invalid or expired token"}`.

## Try the full flow

```bash
curl -i -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

curl -i -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

curl -i http://localhost:3000/protected/profile \
  -H "Authorization: Bearer PASTE_ACCESS_TOKEN_HERE"
```

Change one character in the token and repeat the final request to confirm that
the API rejects it with `401`.

## Swagger UI

Click **Authorize**, paste the access token returned by `/auth/login`, then use
**Try it out** on a protected endpoint.

![Swagger UI with bearer-protected routes](docs/swagger-ui.png)

## Tests

```bash
npm test
```

The test suite uses a small in-memory Supabase test double, so it verifies route
behavior without creating real accounts or requiring secrets.

## Assignment completion checklist

- [x] Supabase client configured entirely through environment variables
- [x] Signup returns `201`; missing credentials return `400`
- [x] Login returns access and refresh tokens; invalid credentials return `401`
- [x] Public information route requires no authentication
- [x] Profile and dashboard routes use one reusable bearer-token guard
- [x] Missing, malformed, tampered, and expired tokens return JSON `401` errors
- [x] Logout is protected and returns `204`
- [x] Swagger UI exposes bearer authorization and protected-route padlocks
- [x] `.env` is ignored and `.env.example` is committed
- [x] Automated tests pass without secrets
- [x] Public GitHub repository includes setup, endpoint table, screenshot, and
      stage checkpoint commits
- [ ] Final live Supabase flow must be run with the developer's private project
      URL and anon key; those values must never be committed

## Security notes

- Passwords are forwarded to Supabase and are never stored or hashed here.
- `.env` is ignored and has never been added to this repository.
- Only the Supabase anon key is expected; the `service_role` key is never used.
- A JWT is signed, not encrypted. Anyone holding one can read its claims, so
  secrets must never be placed inside a token.
- Access tokens are intentionally short-lived to limit the damage if one leaks;
  refresh tokens obtain new access tokens without asking for the password again.

## Author

Mahmoud Elragal — [Ragal-m](https://github.com/Ragal-m)
