# Stage 3 checkpoint

Bearer tokens are verified through `supabase.auth.getUser(token)` in the
reusable guard at `src/auth.js`. Route handlers never trust an unverified JWT.

After obtaining an access token from `/auth/login`:

```bash
curl -i http://localhost:3000/protected/profile \
  -H "Authorization: Bearer PASTE_ACCESS_TOKEN_HERE"
# HTTP/1.1 200 OK

curl -i http://localhost:3000/protected/profile \
  -H "Authorization: Bearer TAMPERED_ACCESS_TOKEN"
# HTTP/1.1 401 Unauthorized
# {"error":"Invalid or expired token"}
```

The automated test double exercises both outcomes. A final end-to-end check
should be run with the developer's own Supabase project URL and anon key.
