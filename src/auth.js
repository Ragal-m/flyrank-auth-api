export function createRequireAuth(supabase) {
  return async function requireAuth(request, response, next) {
    const authorization = request.get("authorization");
    if (!authorization?.startsWith("Bearer ") || authorization.slice(7).trim() === "") {
      return response.status(401).json({ error: "Access token required" });
    }

    const token = authorization.slice(7).trim();
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) {
      return response.status(401).json({ error: "Invalid or expired token" });
    }

    request.user = data.user;
    request.accessToken = token;
    return next();
  };
}
