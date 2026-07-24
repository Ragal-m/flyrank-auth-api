export function createMockSupabase() {
  return {
    auth: {
      signUp: async ({ email }) => ({
        data: { user: { id: "user-123", email } },
        error: null,
      }),
      signInWithPassword: async ({ email, password }) =>
        password === "password123"
          ? {
              data: {
                session: {
                  access_token: "valid-token",
                  refresh_token: "refresh-token",
                },
                user: { id: "user-123", email },
              },
              error: null,
            }
          : { data: { session: null }, error: { message: "Invalid login credentials" } },
      getUser: async (token) =>
        token === "valid-token"
          ? {
              data: {
                user: {
                  id: "user-123",
                  email: "user@example.com",
                  created_at: "2026-07-24T00:00:00.000Z",
                },
              },
              error: null,
            }
          : { data: { user: null }, error: { message: "Invalid JWT" } },
      signOut: async () => ({ error: null }),
    },
  };
}
