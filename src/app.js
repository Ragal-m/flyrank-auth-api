import express from "express";
import swaggerUi from "swagger-ui-express";
import { createRequireAuth } from "./auth.js";
import { openapiDocument } from "./openapi.js";

export function createApp({ supabase }) {
  if (!supabase) {
    throw new Error("A Supabase client is required");
  }

  const app = express();
  app.disable("x-powered-by");
  app.use(express.json({ limit: "10kb" }));
  const requireAuth = createRequireAuth(supabase);
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapiDocument));
  app.get("/openapi.json", (_request, response) => response.json(openapiDocument));

  app.post("/auth/signup", async (request, response) => {
    const { email, password } = request.body ?? {};
    if (!email || !password) {
      return response.status(400).json({ error: "Email and password are required" });
    }

    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      return response.status(400).json({ error: error.message });
    }

    return response.status(201).json({ user: data.user });
  });

  app.post("/auth/login", async (request, response) => {
    const { email, password } = request.body ?? {};
    if (!email || !password) {
      return response.status(400).json({ error: "Email and password are required" });
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.session) {
      return response.status(401).json({ error: "Invalid login credentials" });
    }

    return response.status(200).json({
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
    });
  });

  app.get("/health", (_request, response) => {
    response.status(200).json({ status: "ok" });
  });

  app.get("/public/info", (_request, response) => {
    response.status(200).json({ message: "Welcome stranger! This info is public." });
  });

  app.get("/protected/profile", requireAuth, (request, response) => {
    const { id, email, created_at } = request.user;
    return response.status(200).json({ user: { id, email, created_at } });
  });

  app.get("/protected/dashboard", requireAuth, (request, response) => {
    response.status(200).json({
      message: `Welcome to your dashboard, ${request.user.email}`,
    });
  });

  app.post("/auth/logout", requireAuth, async (_request, response) => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      return response.status(400).json({ error: error.message });
    }
    return response.status(204).send();
  });

  return app;
}
