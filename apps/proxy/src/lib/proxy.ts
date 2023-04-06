import { createOAuthUserAuth } from '@octokit/auth-oauth-user';
import { Request, Response } from 'express';
import { z } from 'zod';
import { EnvSchemaType } from './env';
import { ProxyError } from './error';

export const createProxyApi = (env: EnvSchemaType) => ({
  async auth(req: Request, res: Response) {
    const parsedQuery = authQuerySchema.safeParse(req.query);

    if (parsedQuery.success === false) {
      throw new ProxyError(400, 'Bad Request Parameter `code`');
    }

    const auth = createOAuthUserAuth({
      clientType: 'oauth-app',
      clientId: env.OAUTH_APP_CLIENT_ID,
      clientSecret: env.OAUTH_APP_SECRET,
      scopes: env.OAUTH_APP_SCOPES,
      code: parsedQuery.data.code,
    });

    let token: string;
    try {
      const authResult = await auth();
      token = authResult.token;
    } catch {
      throw new ProxyError(401, 'OAuth Authentication Failed');
    }

    //log info before token param is set to prevent logging access tokens
    req.log.info(`302 Redirect to ${env.REDIRECT_URL}`);

    const redirectUrl = new URL(env.REDIRECT_URL);
    redirectUrl.searchParams.set('token', token);

    //redirect with 302
    res.status(302).redirect(redirectUrl.href);
  },
});

const authQuerySchema = z.object({
  code: z.string(),
});
