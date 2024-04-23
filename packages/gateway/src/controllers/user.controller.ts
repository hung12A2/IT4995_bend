// Uncomment these imports to begin using these cool features!

import {inject} from '@loopback/core';
import {post, requestBody, get, RestBindings, Response} from '@loopback/rest';
import {UserServiceBindings} from '../key';
import {UserManagementService} from '../services/userManament.service';
import {TokenServiceBindings, User} from '@loopback/authentication-jwt';
import {JWTService} from '../services/jwt.service';
import {authenticate} from '@loopback/authentication';
import {SecurityBindings, UserProfile} from '@loopback/security';
import {AdminManagementService} from '../services/adminManagment.service';
import {EmployeeManagementService} from '../services/employeeManagment.service';
import axios from '../services/authAxios.service';

// import {inject} from '@loopback/core';

export class UserController {
  constructor(
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: JWTService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: UserManagementService,
    @inject(UserServiceBindings.ADMIN_SERVICE)
    public adminService: AdminManagementService,
    @inject(UserServiceBindings.EMPLOYEE_SERVICE)
    public employeeService: EmployeeManagementService,
    @inject(RestBindings.Http.RESPONSE) public response: Response,
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
  async loginCustomer(
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

    if (!foundUser)
      return {
        code: 400,
        message: 'Invalid email or password',
      };

    const userProfile = this.userService.convertToUserProfile(foundUser);

    const token = await this.jwtService.generateToken(userProfile);

    return {
      code: 200,
      token,
    };
  }

  @post('login/admin', {
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
    req: any,
  ): Promise<any> {
    const {email, password} = req;
    const foundUser = await this.adminService.verifyCredentials({
      email,
      password,
    });

    if (!foundUser) return {
      code:401,
      message: 'Invalid email or password'
    }

    const userProfile = this.adminService.convertToUserProfile(foundUser);

    const token = await this.jwtService.generateToken(userProfile);

    return {
      code: 200,
      token
    }
  }

  @post('login/employee', {
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
  async loginEmployee(
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
    const foundUser = await this.employeeService.verifyCredentials({
      email,
      password,
    });

    if (!foundUser) return { code: 401, message: 'Invalid email or password'}

    const userProfile = this.employeeService.convertToUserProfile(foundUser);

    const token = await this.jwtService.generateToken(userProfile);

    return {
      code:200,
      token
    }
  }

  @post('/register/customer', {
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
  async registerCustomer(
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
              phoneNumber: {
                type: 'string',
              },
              gender: {
                type: 'string',
              },
              fullName: {
                type: 'string',
              },
            },
          },
        },
      },
    })
    newUserRequest: any,
  ): Promise<any> {
    const {email, password, phoneNumber, gender, fullName} = newUserRequest;
    const data = await axios
      .post(`register/customer`, {
        email,
        password,
        phoneNumber,
        gender,
        fullName,
      })
      .then(res => res)
      .catch(e => console.log(e));
    return data;
  }

  @post('/register/admin', {
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
    newUserRequest: object,
  ): Promise<any> {
    const data = await axios
      .post(`register/admin`, newUserRequest)
      .then(res => res)
      .catch(e => console.log(e));

    return data;
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
