import {
  TokenService,
  UserService,
  authenticate,
} from '@loopback/authentication';
import {
  TokenServiceBindings,
  UserRepository,
} from '@loopback/authentication-jwt';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  Response,
  RestBindings,
  get,
  getModelSchemaRef,
  post,
  requestBody,
} from '@loopback/rest';
import {SecurityBindings, UserProfile, securityId} from '@loopback/security';
import {UserServiceBindings} from '../keys';
import {Admin, User} from '../models';
import {Credentials} from '../types';
import { AdminRepository } from '../repositories';
import { AdminManagmentService } from '../services/adminManagement.service';

export class UserManagementController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: UserService<User, any>,
    @repository (AdminRepository)
    public adminrepository: AdminRepository, 
    @inject (UserServiceBindings.ADMIN_SERVICE)
    public adminService: AdminManagmentService, 
    @inject(RestBindings.Http.RESPONSE)
    private response: Response,
  ) {}

  @post('/users/customer', {
    responses: {
      '200': {
        description: 'User',
        content: {
          'application/json': {
            schema: {
              'x-ts-type': User,
            },
          },
        },
      },
    },
  })
  async createCustomer(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'NewUser',
            exclude: ['id', 'role', 'isSeller'],
          }),
        },
      },
    })
    newUserRequest: Omit<User, 'id'>,
  ): Promise<any> {
    // All new users have the "customer" role by default
    newUserRequest.role = 'customer';
    newUserRequest.isSeller = false;

    try {
      if (
        (
          await this.userRepository.find({
            where: {email: newUserRequest.email},
          })
        ).length > 0
      ) {
        return this.response.status(400).send('Đã tồn tại email này rồi');
      }
      const data = await this.userRepository.create(newUserRequest);
      return data;
    } catch (error) {
      throw error;
    }
  }

  @post('/users/admin', {
    responses: {
      '200': {
        description: 'User',
        content: {
          'application/json': {
            schema: {
              'x-ts-type': User,
            },
          },
        },
      },
    },
  })
  async createAdmin(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Admin, {
            title: 'NewAdmin',
            exclude: ['id', 'role' ],
          }),
        },
      },
    })
    newUserRequest: Omit<User, 'id' >,
  ): Promise<any> {
    // All new users have the "customer" role by default
    newUserRequest.role = 'admin';
    newUserRequest.permissions = 'all'

    try {
      const list = await this.userRepository.find({
        where: {email: newUserRequest.email},
      });
      if (list.length > 0) {
        return this.response.status(400).send('Đã tồn tại username này rồi');
      }
      const data = await this.adminrepository.create(newUserRequest);
      return data;
    } catch (error) {
      throw error;
    }
  }

  @post('/users/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async login(
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
    credentials: Credentials,
  ): Promise<{token: string}> {
    // ensure the user exists, and the password is correct
    const user = await this.userService.verifyCredentials(credentials);

    // convert a User object into a UserProfile object (reduced set of properties)
    const userProfile = this.userService.convertToUserProfile(user);

    // create a JSON Web Token based on the user profile
    const token = await this.jwtService.generateToken(userProfile);

    return {token};
  }

  @post('/admin/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async loginAdmin(
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
    credentials: Credentials,
  ): Promise<{token: string}> {
    // ensure the user exists, and the password is correct
    const user = await this.adminService.verifyCredentials(credentials);

    // convert a User object into a UserProfile object (reduced set of properties)
    const adminProfile = this.adminService.convertToUserProfile(user);

    // create a JSON Web Token based on the user profile
    const token = await this.jwtService.generateToken(adminProfile);

    return {token};
  }

  @authenticate('jwt')
  // @authorize({allowedRoles: ['admin'], voters: [basicAuthorization]})
  @get('/customer/whoAmI', {
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
  async whoAmICustomer(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<any> {
    return currentUserProfile;
  }

  @authenticate ('jwt')
  @get('/admin/whoAmI', {
    responses: {
      '200': {
        description: 'Return current admin',
        content: {
          'application/json': {
            schema: {
              type: 'ADMIN',
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
    return currentUserProfile ;
  }
}
