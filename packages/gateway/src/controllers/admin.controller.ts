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
  response,
  patch,
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

export class AdminController {
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

  @authenticate('jwt')
  @authorize({
    allowedRoles: ['admin', 'admin-managment'],
    voters: [basicAuthorization],
  })
  @post('/admins')
  @response(200, {
    description: 'Admin model instance',
    content: {
      'application/json': {
        schema: {
          type: 'object',
        },
      },
    },
  })
  async create(
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              email: {type: 'string'},
              permissions: {type: 'string'},
              name: {type: 'string'},
              phoneNumber: {type: 'string'},
            },
          },
        },
      },
    })
    admin: any,
  ): Promise<any> {
    const {email, permissions, name, phoneNumber} = admin;
    const data = await axios
      .post(
        '/admins',
        {
          email,
          permissions,
          name,
          phoneNumber,
        },
        {
          headers: {
            Authorization: this.request.headers.authorization,
          },
        },
      )
      .then(res => res)
      .catch(err => err);

    return data;
  }

  @authenticate('jwt')
  @authorize({
    allowedRoles: ['admin', 'admin-managment'],
    voters: [basicAuthorization],
  })
  @get('/admins')
  @response(200, {
    description: 'Array of Admin model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: {
            type: 'object',
          },
        },
      },
    },
  })
  async find(@param.query.object(`filter`) filter: string): Promise<any> {
    const data = await axios.get('/admins', {
      params: {filter},
      headers: {
        Authorization: this.request.headers.authorization,
      },
    });
    return data;
  }

  @authenticate('jwt')
  @authorize({
    allowedRoles: ['admin', 'admin-managment'],
    voters: [basicAuthorization],
  })
  @get('/admins/count')
  @response(200, {
    description: 'Array of Admin model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: {
            type: 'object',
          },
        },
      },
    },
  })
  async count(@param.query.object(`filter`) filter: string): Promise<any> {
    const data = await axios.get('/admins/count', {
      params: {filter},
      headers: {
        Authorization: this.request.headers.authorization,
      },
    });
    return data;
  }

  @authenticate('jwt')
  @authorize({
    allowedRoles: ['admin', 'admin-managment'],
    voters: [basicAuthorization],
  })
  @get('/admins/{id}')
  @response(200, {
    description: 'Admin model instance',
    content: {
      'application/json': {
        schema: {
          type: 'object',
        },
      },
    },
  })
  async findById(@param.path.string('id') id: string): Promise<any> {
    const data = await axios.get(`/admins/${id}`, {
      headers: {
        Authorization: this.request.headers.authorization,
      },
    });
  }

  @authenticate('jwt')
  @authorize({
    allowedRoles: ['admin', 'admin-managment'],
    voters: [basicAuthorization],
  })
  @patch('/admins/{id}')
  @response(204, {
    description: 'Admin PATCH success',
  })
  async updateById(
    @inject(SecurityBindings.USER)
    currentUser: UserProfile,
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              email: {type: 'string'},
              permissions: {type: 'string'},
              name: {type: 'string'},
              phoneNumber: {type: 'string'},
            },
          },
        },
      },
    })
    admin: any,
  ): Promise<any> {
    const {email, permissions, name, phoneNumber} = admin;
    const data = await axios
      .patch(
        `/admins/${id}`,
        {
          email,
          permissions,
          name,
          phoneNumber,
        },
        {
          headers: {
            Authorization: this.request.headers.authorization,
          },
        },
      )
      .then(res => res)
      .catch(err => err);

    return data;
  }

  @authenticate('jwt')
  @authorize({
    voters: [basicAuthorization],
    allowedRoles: ['admin', 'users-Managment'],
  })
  @post('/admins/banned/{idOfUser}', {
    responses: {
      '200': {
        description: 'User',
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
  async BanCustomer(
    @param.path.string('idOfUser') idOfUser: string,
    @inject(SecurityBindings.USER)
    currentUser: UserProfile,
  ): Promise<any> {
    const data = await axios.post(
      `/admins/banned/${idOfUser}`,
      {},
      {
        headers: {
          Authorization: this.request.headers.authorization,
        },
      },
    );
  }

  @authenticate('jwt')
  @authorize({
    voters: [basicAuthorization],
    allowedRoles: ['admin', 'users-Managment'],
  })
  @post('/admins/unbanned/{idOfUser}', {
    responses: {
      '200': {
        description: 'User',
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
  async unBanned(
    @param.path.string('idOfUser') idOfUser: string,
    @inject(SecurityBindings.USER)
    currentUser: UserProfile,
  ): Promise<any> {
    const data = await axios
      .post(
        `/admins/unbanned/${idOfUser}`,
        {},
        {
          headers: {
            Authorization: this.request.headers.authorization,
          },
        },
      )
      .then(res => res)
      .catch(err => err);
    return data;
  }
}
