import {TokenService} from '@loopback/authentication';
import {TokenServiceBindings} from '@loopback/authentication-jwt';
import {inject} from '@loopback/context';
import {del, HttpErrors} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';
import {promisify} from 'util';

const jwt = require('jsonwebtoken');
const signAsync = promisify(jwt.sign);
const verifyAsync = promisify(jwt.verify);

export class JWTService implements TokenService {
  constructor(
    @inject(TokenServiceBindings.TOKEN_SECRET)
    private jwtSecret: string,
    @inject(TokenServiceBindings.TOKEN_EXPIRES_IN)
    private jwtExpiresIn: string,
  ) {}

  async verifyToken(token: string): Promise<UserProfile> {
    if (!token) {
      throw new HttpErrors.Unauthorized(
        `Error verifying token : 'token' is null`,
      );
    }

    let userProfile: UserProfile;

    try {
      // decode user profile from token
      const decodedToken = await verifyAsync(token, this.jwtSecret);
      // don't copy over  token field 'iat' and 'exp', nor 'email' to user profile
      const role = decodedToken.role;
      delete decodedToken.iat;
      delete decodedToken.exp;
      if (role == 'customer ') {
        userProfile = Object.assign(
          {[securityId]: '', name: ''},
          {
            [securityId]: decodedToken.id,
            ...decodedToken,
          },
        );
      } else if (role == 'admin') {
        userProfile = Object.assign(
          {[securityId]: '', name: ''},
          {
            [securityId]: decodedToken.id,
            ...decodedToken,
          },
        );
      } else {
        userProfile = Object.assign(
          {[securityId]: '', name: ''},
          {
            [securityId]: decodedToken.id,
            ...decodedToken,
          },
        );
      }
    } catch (error) {
      throw new HttpErrors.Unauthorized(
        `Error verifying token : ${error.message}`,
      );
    }
    return userProfile;
  }

  async generateToken(userProfile: UserProfile): Promise<string> {
    if (!userProfile) {
      throw new HttpErrors.Unauthorized(
        'Error generating token : userProfile is null',
      );
    }

    let userInfoForToken;
    if (userProfile.role == 'customer') {
      userInfoForToken = {
        ...userProfile,
      };
    } else if (userProfile.role == 'admin') {
      userInfoForToken = {
        ...userProfile,
      };
    } else {
      userInfoForToken = {
        ...userProfile,
      };
    }

    // Generate a JSON Web Token
    let token: string;
    try {
      token = await signAsync(userInfoForToken, this.jwtSecret, {
        expiresIn: Number(this.jwtExpiresIn),
      });
    } catch (error) {
      throw new HttpErrors.Unauthorized(`Error encoding token : ${error}`);
    }

    return token;
  }
}
