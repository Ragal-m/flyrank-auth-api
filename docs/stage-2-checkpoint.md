# Stage 2 checkpoint

The public and protected gates are implemented in `src/app.js`.

Expected checks:

```bash
curl -i http://localhost:3000/public/info
# HTTP/1.1 200 OK
# {"message":"Welcome stranger! This info is public."}

curl -i http://localhost:3000/protected/profile
# HTTP/1.1 401 Unauthorized
# {"error":"Access token required"}
```

Automated coverage is in `test/routes.test.js`. It verifies that:

- `/public/info` is available without authentication.
- `/protected/profile` rejects a missing token.
- `/protected/profile` rejects a malformed authorization scheme.
