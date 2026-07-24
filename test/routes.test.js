import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { createApp } from "../src/app.js";
import { createMockSupabase } from "./helpers.js";

test("public info is open and protected profile requires a bearer token", async () => {
  const app = createApp({ supabase: createMockSupabase() });

  const publicInfo = await request(app).get("/public/info");
  assert.equal(publicInfo.status, 200);

  const missing = await request(app).get("/protected/profile");
  assert.equal(missing.status, 401);
  assert.deepEqual(missing.body, { error: "Access token required" });

  const malformed = await request(app)
    .get("/protected/profile")
    .set("Authorization", "Basic credentials");
  assert.equal(malformed.status, 401);

  const valid = await request(app)
    .get("/protected/profile")
    .set("Authorization", "Bearer valid-token");
  assert.equal(valid.status, 200);
  assert.equal(valid.body.user.email, "user@example.com");

  const tampered = await request(app)
    .get("/protected/profile")
    .set("Authorization", "Bearer tampered-token");
  assert.equal(tampered.status, 401);
  assert.deepEqual(tampered.body, { error: "Invalid or expired token" });

  const dashboard = await request(app)
    .get("/protected/dashboard")
    .set("Authorization", "Bearer valid-token");
  assert.equal(dashboard.status, 200);
});

test("Swagger UI and the bearer security scheme are available", async () => {
  const app = createApp({ supabase: createMockSupabase() });

  const docs = await request(app).get("/docs/");
  assert.equal(docs.status, 200);
  assert.match(docs.text, /Swagger UI/);

  const schema = await request(app).get("/openapi.json");
  assert.equal(schema.status, 200);
  assert.equal(schema.body.components.securitySchemes.bearerAuth.scheme, "bearer");
  assert.deepEqual(schema.body.paths["/protected/profile"].get.security, [{ bearerAuth: [] }]);
});
