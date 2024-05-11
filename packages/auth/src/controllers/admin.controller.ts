import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {Admin} from '../models';
import {AdminRepository} from '../repositories';
import {generateRandomString} from '../utils/genString';
import {authenticate} from '@loopback/authentication';
import {auth} from 'firebase-admin';
import {authorize} from '@loopback/authorization';
import {basicAuthorization} from '../services/basicAuthorize';
import {inject} from '@loopback/core';
import {SecurityBindings, UserProfile, securityId} from '@loopback/security';

export class AdminController {
  constructor(
    @repository(AdminRepository)
    public adminRepository: AdminRepository,
  ) {}

  @authenticate('jwt')
  @authorize({
    allowedRoles: ['admin', 'admin-managment'],
    voters: [basicAuthorization],
  })
  @post('/admins')
  @response(200, {
    description: 'Admin model instance',
    content: {'application/json': {schema: getModelSchemaRef(Admin)}},
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
  ): Promise<Admin> {
    admin.role = 'admin';
    admin.status = 'active';
    admin.password = generateRandomString(10);
    const time = new Date().toLocaleString();
    if (!admin.name) {
      admin.name = admin.email;
    }
    if (!admin.phoneNumber) {
      admin.phoneNumber = '';
    }
    admin.createdAt = time;
    admin.updatedAt = time;
    admin.updatedBy = `admin-${currentUserProfile.id}`;
    admin.createdBy = `admin-${currentUserProfile.id}`;
    return this.adminRepository.create(admin);
  }

  @authenticate('jwt')
  @authorize({
    allowedRoles: ['admin'],
    voters: [basicAuthorization],
  })
  @get('/admins')
  @response(200, {
    description: 'Array of Admin model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Admin, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(Admin) filter?: Filter<Admin>): Promise<Admin[]> {
    return this.adminRepository.find(filter);
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
          items: getModelSchemaRef(Admin, {includeRelations: true}),
        },
      },
    },
  })
  async count(@param.filter(Admin) filter?: Filter<Admin>): Promise<any> {
    return this.adminRepository.count(filter);
  }

  @get('/admins/{id}')
  @response(200, {
    description: 'Admin model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Admin, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
  ): Promise<Admin> {
    return this.adminRepository.findById(id);
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
          schema: getModelSchemaRef(Admin, {partial: true}),
        },
      },
    })
    admin: Admin,
  ): Promise<any> {
    admin.updatedAt = new Date().toLocaleString();
    admin.updatedBy = `admin-${currentUser.id}`;
    await this.adminRepository.updateById(id, admin);
    return {
      code:200,
      data: await this.adminRepository.findById(id)
    }
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
              'x-ts-type': Admin,
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
    const time = new Date().toLocaleString();
    try {
      const data = await this.adminRepository.updateById(idOfUser, {
        status: 'banned',
        updatedAt: time,
        updatedBy: `admin-${currentUser.id}`,
      });
      return {
        code: 200,
        message: `Update success`,
      };
    } catch (error) {
      throw error;
    }
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
              'x-ts-type': Admin,
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
    const time = new Date().toLocaleString();
    try {
      const data = await this.adminRepository.updateById(idOfUser, {
        status: 'active',
        updatedAt: time,
        updatedBy: `admin-${currentUser.id}`,
      });
      return {
        code: 200,
        message: `Update success`,
      };
    } catch (error) {
      throw error;
    }
  }
}
