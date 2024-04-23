// Uncomment these imports to begin using these cool features!

import {inject} from '@loopback/core';
import {post, requestBody, get} from '@loopback/rest';
import {UserServiceBindings} from '../key';
import {UserManagementService} from '../services/userManament.service';
import {TokenServiceBindings} from '@loopback/authentication-jwt';
import {JWTService} from '../services/jwt.service';
import {authenticate} from '@loopback/authentication';
import {SecurityBindings, UserProfile} from '@loopback/security';

// import {inject} from '@loopback/core';

export class UserController {
  constructor(
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: JWTService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: UserManagementService,
  ) {}

  @post('login/customer', {
    responses: {
      '200': {
        description: 'Return current user',
        content: {
          'application/json': {
            schema: {
              type: 'USER',
            },
          },
        },
      },
    },
  })
  async getUserByPassword(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              email: {
                type: 'string',
              },
              password: {
                type: 'string',
              },
            },
          },
        },
      },
    })
    req: any,
  ): Promise<any> {
    const {email, password} = req;
    const foundUser = await this.userService.verifyCredentials({
      email,
      password,
    });

    const userProfile = this.userService.convertToUserProfile(foundUser);

    const token = await this.jwtService.generateToken(userProfile);

    return token;
  }

  @authenticate('jwt')
  // @authorize({allowedRoles: ['admin'], voters: [basicAuthorization]})
  @get('whoAmI', {
    responses: {
      '200': {
        description: 'Return current user',
        content: {
          'application/json': {
            schema: {
              type: 'USER',
            },
          },
        },
      },
    },
  })
  async whoAmI(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<any> {
    return currentUserProfile;
  }
}
