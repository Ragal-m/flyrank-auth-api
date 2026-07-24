import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { createApp } from "../src/app.js";
import { createMockSupabase } from "./helpers.js";

test("signup validates credentials and creates a user", async () => {
  const app = createApp({ supabase: createMockSupabase() });

  const missing = await request(app).post("/auth/signup").send({ email: "user@example.com" });
  assert.equal(missing.status, 400);

  const created = await request(app)
    .post("/auth/signup")
    .send({ email: "user@example.com", password: "password123" });
  assert.equal(created.status, 201);
  assert.equal(created.body.user.email, "user@example.com");
});

test("login returns tokens and rejects invalid credentials", async () => {
  const app = createApp({ supabase: createMockSupabase() });

  const valid = await request(app)
    .post("/auth/login")
    .send({ email: "user@example.com", password: "password123" });
  assert.equal(valid.status, 200);
  assert.equal(valid.body.access_token, "valid-token");

  const invalid = await request(app)
    .post("/auth/login")
    .send({ email: "user@example.com", password: "wrong" });
  assert.equal(invalid.status, 401);
});

test("logout is protected and returns no content", async () => {
  const app = createApp({ supabase: createMockSupabase() });

  const unauthorized = await request(app).post("/auth/logout");
  assert.equal(unauthorized.status, 401);

  const loggedOut = await request(app)
    .post("/auth/logout")
    .set("Authorization", "Bearer valid-token");
  assert.equal(loggedOut.status, 204);
});
