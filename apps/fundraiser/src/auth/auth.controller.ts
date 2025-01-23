import { Controller, Get, Query, Req, Res } from '@nestjs/common';
import { google } from 'googleapis';
import { env } from '@common/environments/fundraiser.env';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { JWTService } from '../jwt/jwt.service';
import { randomBytes } from 'crypto';

type OAuthReturnedData = {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
  locale: string;
};

@Controller('auth')
export class AuthController {
  constructor(
    private readonly _authService: AuthService,
    private readonly _jwtService: JWTService,
  ) {}
  @Get()
  async getAuth() {
    return randomBytes(32).toString('hex');
  }

  @Get('url')
  async getGoogleAuthUrl(@Req() req: Request) {
    if (req.signedCookies?.tk) {
      return { success: true, url: env.clientUrl };
    }

    const client = this.getOAuthClient();
    const scopes = [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ];

    const url = client.generateAuthUrl({
      scope: scopes,
      access_type: 'offline',
    });

    return { success: true, url };
  }

  // http://localhost/api/v1/auth/callback?code=4%2F0AeaYSHDZR_radH2gVXakfQPkwJYSdqLGDk-LBYw2t7al2T7b-ELFwxQpdjHTXcDA8McZ_Q&scope=email+profile+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+openid&authuser=1&prompt=consent
  @Get('callback')
  async googleCallback(
    @Query() query: { code?: string; error?: string },
    @Res() res: Response,
  ) {
    try {
      if (query.error || !query.code) {
        return res.redirect(env.clientUrl);
      }

      const { code } = query;
      const client = this.getOAuthClient();

      const { tokens } = await client.getToken(code);
      client.setCredentials(tokens);

      const userInfo = await client.request<OAuthReturnedData>({
        url: 'https://www.googleapis.com/oauth2/v3/userinfo',
      });

      const { data } = userInfo;

      if (userInfo) {
        const user = await this._authService.findOrCreateUser({
          email: data.email,
          firstName: data.given_name ?? '',
          lastName: data.family_name ?? '',
          avatar: data.picture ?? '',
        });

        const token = this._jwtService.sign(
          {
            userId: user.id,
            refreshToken: user.refreshToken,
          },
          { expiresIn: '30d' },
        );

        res.cookie('tk', token, {
          signed: true,
          httpOnly: true,
          secure: env.mode !== 'dev',
          sameSite: 'strict',
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        });
      }

      res.redirect(`${env.clientUrl}?type=authenticated`);
    } catch (error) {
      res.redirect(`${env.clientUrl}?type=unauthenticated`);
    }
  }

  private getOAuthClient() {
    return new google.auth.OAuth2({
      redirectUri: `${env.serverUrl}/v1/auth/callback`,
      clientSecret: env.googleOAuthClientSecret,
      clientId: env.googleOAuthClientId,
    });
  }
}
