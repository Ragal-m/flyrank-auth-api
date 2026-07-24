export const openapiDocument = {
  openapi: "3.0.3",
  info: {
    title: "FlyRank Auth API",
    version: "1.0.0",
    description: "Supabase-backed signup, login, logout, and protected routes.",
  },
  servers: [{ url: "http://localhost:3000" }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      Credentials: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email" },
          password: { type: "string", minLength: 6 },
        },
      },
      Error: {
        type: "object",
        properties: { error: { type: "string" } },
      },
    },
  },
  paths: {
    "/auth/signup": {
      post: {
        summary: "Create a user account",
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/Credentials" } },
          },
        },
        responses: {
          201: { description: "User created" },
          400: { description: "Invalid input" },
        },
      },
    },
    "/auth/login": {
      post: {
        summary: "Log in and receive access and refresh tokens",
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/Credentials" } },
          },
        },
        responses: {
          200: { description: "Authenticated" },
          400: { description: "Missing input" },
          401: { description: "Invalid credentials" },
        },
      },
    },
    "/auth/logout": {
      post: {
        summary: "Log out the authenticated user",
        security: [{ bearerAuth: [] }],
        responses: {
          204: { description: "Logged out" },
          401: { description: "Missing or invalid token" },
        },
      },
    },
    "/public/info": {
      get: {
        summary: "Read public information",
        responses: { 200: { description: "Public information" } },
      },
    },
    "/protected/profile": {
      get: {
        summary: "Read the authenticated user's profile",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "User profile" },
          401: { description: "Missing or invalid token" },
        },
      },
    },
    "/protected/dashboard": {
      get: {
        summary: "Read the authenticated user's dashboard",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "Dashboard" },
          401: { description: "Missing or invalid token" },
        },
      },
    },
  },
};
