# Openmd Proxy Server

Openmd proxy server is a proxy for [`@octokit/auth-oauth-user`](https://github.com/octokit/auth-oauth-user.js/) authentication strategy.

It allows for generating an access token on behalf of the user for an oauth application.

Since the `@octokit/auth-oauth-user` authentication strategy requires an oauth secret key, this strategy cannot be used directly in the browser.

The proxy server solves this issue by generating an access token for the user with "the code for token exchange process".
Read more [GitHub's OAuth web flow](https://docs.github.com/en/developers/apps/authorizing-oauth-apps#web-application-flow).

## Authentication Flow

- Users are first redirected to request their GitHub identity.
- If they accept the request GitHub then redirects to the proxy `/auth` endpoint with a temporary `code`.
- The proxy uses the `@octokit/auth-oauth-user` package to exchange the `code` for an access token.
- The proxy then redirects to the openmd client with the created access token.

## Proxy API

| Request | Query params     | Response                        |
| ------- | ---------------- | ------------------------------- |
| /       |                  | { "version": "x.x.x" }          |
| /auth   | { code: string } | 302 redirect (env.REDIRECT_URL) |

## Environment Variables

```typescript
const envSchema = z.object({
  NODE_ENV: z
    .union([z.literal('production'), z.literal('development')])
    .default('development'),
  PROXY_URL: withDevDefault(
    z.string().url(),
    'http://localhost:3333'
  ).transform(parseURL),
  REDIRECT_URL: z.string().url().transform(parseURL),
  OAUTH_APP_CLIENT_ID: z.string(),
  OAUTH_APP_SECRET: z.string(),
  npm_package_version: z.string(),
});
```
