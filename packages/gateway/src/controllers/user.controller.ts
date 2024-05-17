// Uncomment these imports to begin using these cool features!

import {inject} from '@loopback/core';
import {
  post,
  requestBody,
  get,
  RestBindings,
  Response,
  Request,
  param,
} from '@loopback/rest';
import {UserServiceBindings} from '../key';
import {UserManagementService} from '../services/userManament.service';
import {TokenServiceBindings, User} from '@loopback/authentication-jwt';
import {JWTService} from '../services/jwt.service';
import {authenticate} from '@loopback/authentication';
import {SecurityBindings, UserProfile} from '@loopback/security';
import {AdminManagementService} from '../services/adminManagment.service';
import {EmployeeManagementService} from '../services/employeeManagment.service';
import axios from '../services/authAxios.service';
import {authorize} from '@loopback/authorization';
import {basicAuthorization} from '../services/basicAuthorize';

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
    @inject(RestBindings.Http.REQUEST) public request: Request,
  ) {}

  @post('login/Customer', {
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
    const token = await this.userService.verifyCredentials({
      email,
      password,
    });

    if (!token)
      return {
        code: 401,
        message: 'Invalid email or password',
      };

    return {
      token,
    };
  }

  @post('login/Admin', {
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
    const token = await this.adminService.verifyCredentials({
      email,
      password,
    });

    if (!token)
      return {
        code: 401,
        message: 'Invalid email or password',
      };

    return {
      token,
    };
  }

  @post('login/Employee', {
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
    const token = await this.employeeService.verifyCredentials({
      email,
      password,
    });

    if (!token) return {code: 401, message: 'Invalid email or password'};

    return {
      token,
    };
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
              name: {
                type: 'string',
              },
              phoneNumber: {
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

  @post('/forgotPassword/customer', {
    responses: {
      '200': {
        description: 'send mail to reset password',
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
      },
    },
  })
  async forgotPassword(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              email: {
                type: 'string',
              },
            },
          },
        },
      },
    })
    req: any,
  ): Promise<any> {
    const data = await axios
      .post('/forgotPassword/Customer', req)
      .then(res => res)
      .catch(e => console.log(e));

    return data;
  }

  @post('/forgotPassword/admin', {
    responses: {
      '200': {
        description: 'send mail to reset password',
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
      },
    },
  })
  async forgotPasswordAdmin(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              email: {
                type: 'string',
              },
            },
          },
        },
      },
    })
    req: any,
  ): Promise<any> {
    const data = await axios
      .post('/forgotPassword/Admin', req)
      .then(res => res)
      .catch(e => console.log(e));

    return data;
  }

  @post('/forgotPassword/employee', {
    responses: {
      '200': {
        description: 'send mail to reset password',
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
      },
    },
  })
  async forgotPasswordEmployee(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              email: {
                type: 'string',
              },
            },
          },
        },
      },
    })
    req: any,
  ): Promise<any> {
    const data = await axios
      .post('/forgotPassword/Employee', req)
      .then(res => res)
      .catch(e => console.log(e));

    return data;
  }

  @post('/resetPassword/customer', {
    responses: {
      '200': {
        description: 'Change Password',
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
      },
    },
  })
  async resetPassword(
    @requestBody({
      description: 'Change Password',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              token: {
                type: 'string',
              },
              newPassword: {
                type: 'string',
              },
            },
          },
        },
      },
    })
    {token, newPassword}: {token: string; newPassword: string},
  ): Promise<any> {
    const data = await axios
      .post('/resetPassword/Customer', {token, newPassword})
      .then(res => res)
      .catch(e => console.log(e));

    return data;
  }

  @post('/resetPassword/admin', {
    responses: {
      '200': {
        description: 'Change Password',
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
      },
    },
  })
  async resetPasswordAdmin(
    @requestBody({
      description: 'Change Password',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              token: {
                type: 'string',
              },
              newPassword: {
                type: 'string',
              },
            },
          },
        },
      },
    })
    {token, newPassword}: {token: string; newPassword: string},
  ): Promise<any> {
    const data = await axios
      .post('/resetPassword/Admin', {token, newPassword})
      .then(res => res)
      .catch(e => console.log(e));

    return data;
  }

  @post('/resetPassword/Employee', {
    responses: {
      '200': {
        description: 'Change Password',
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
      },
    },
  })
  async resetPasswordEmpl(
    @requestBody({
      description: 'Change Password',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              token: {
                type: 'string',
              },
              newPassword: {
                type: 'string',
              },
            },
          },
        },
      },
    })
    {token, newPassword}: {token: string; newPassword: string},
  ): Promise<any> {
    const data = await axios
      .post('/resetPassword/Employee', {token, newPassword})
      .then(res => res)
      .catch(e => console.log(e));

    return data;
  }

  @authenticate('jwt')
  @post('/changePassword/customer', {
    responses: {
      '200': {
        description: 'Change Password',
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
      },
    },
  })
  async changePassword(
    @requestBody({
      description: 'Change Password',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              oldPassword: {
                type: 'string',
              },
              newPassword: {
                type: 'string',
              },
            },
          },
        },
      },
    })
    req: {
      oldPassword: string;
      newPassword: string;
    },
  ): Promise<any> {
    const data = await axios
      .post(
        '/changePassword/customer',
        {
          oldPassword: req.oldPassword,
          newPassword: req.newPassword,
        },
        {
          headers: {
            authorization: `${this.request.headers.authorization}`,
          },
        },
      )
      .then(res => res)
      .catch(e => console.log(e.response.data));

    return data;
  }

  @authenticate('jwt')
  @post('/changePassword/admin', {
    responses: {
      '200': {
        description: 'Change Password',
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
      },
    },
  })
  async changePasswordAdmin(
    @requestBody({
      description: 'Change Password',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              oldPassword: {
                type: 'string',
              },
              newPassword: {
                type: 'string',
              },
            },
          },
        },
      },
    })
    req: {
      oldPassword: string;
      newPassword: string;
    },
  ): Promise<any> {
    const data = await axios
      .post(
        '/changePassword/Admin',
        {
          oldPassword: req.oldPassword,
          newPassword: req.newPassword,
        },
        {
          headers: {
            authorization: `${this.request.headers.authorization}`,
          },
        },
      )
      .then(res => res)
      .catch(e => console.log(e.response.data));

    return data;
  }

  @authenticate('jwt')
  @post('/changePassword/employees', {
    responses: {
      '200': {
        description: 'Change Password',
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
      },
    },
  })
  async changePasswordEmployee(
    @requestBody({
      description: 'Change Password',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              oldPassword: {
                type: 'string',
              },
              newPassword: {
                type: 'string',
              },
            },
          },
        },
      },
    })
    req: {
      oldPassword: string;
      newPassword: string;
    },
  ): Promise<any> {
    const data = await axios
      .post(
        '/changePassword/employee',
        {
          oldPassword: req.oldPassword,
          newPassword: req.newPassword,
        },
        {
          headers: {
            authorization: `${this.request.headers.authorization}`,
          },
        },
      )
      .then(res => res)
      .catch(e => console.log(e.response.data));

    return data;
  }

  @authenticate('jwt')
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

  @authenticate('jwt')
  @authorize({
    voters: [basicAuthorization],
    allowedRoles: ['admin'],
  })
  @post('/banned/customer/{idOfUser}', {
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
  async BanCustomer(
    @param.path.string('idOfUser') idOfUser: string,
  ): Promise<any> {
    const data = await axios
      .post(
        `/banned/customer/${idOfUser}`,
        {},
        {headers: {Authorization: `${this.request.headers.authorization}`}},
      )
      .then(res => res)
      .catch(e => console.log(e));

    return data;
  }

  @authenticate('jwt')
  @authorize({
    voters: [basicAuthorization],
    allowedRoles: ['admin'],
  })
  @post('/unbanned/customer/{idOfUser}', {
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
  async UnbanCustomer(
    @param.path.string('idOfUser') idOfUser: string,
  ): Promise<any> {
    const data = await axios
      .post(
        `/unbanned/customer/${idOfUser}`,
        {},
        {headers: {Authorization: `${this.request.headers.authorization}`}},
      )
      .then(res => res)
      .catch(e => console.log(e));

    return data;
  }

  @authenticate('jwt')
  @authorize({
    voters: [basicAuthorization],
    allowedRoles: ['admin'],
  })
  @get('getAllUser', {
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
  async getAllUser(
    @param.query.object('filter') filter?: string,
  ): Promise<any> {
    const data = await axios.get(`getAllUser`, {
      params: {
        filter,
      },
      headers: {
        Authorization: `${this.request.headers.authorization}`,
      },
    });

    return data;
  }

  @authenticate('jwt')
  @authorize({
    voters: [basicAuthorization],
    allowedRoles: ['admin'],
  })
  @get('getAllUser/count', {
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
  async getAllUserCount(
    @param.query.object('filter') filter?: string,
  ): Promise<any> {
    const data = await axios.get(`getAllUser/count`, {
      params: {
        filter,
      },
      headers: {
        Authorization: `${this.request.headers.authorization}`,
      },
    });

    return data;
  }
}
