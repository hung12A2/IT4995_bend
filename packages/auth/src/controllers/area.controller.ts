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
import {Area} from '../models';
import {AreaRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {basicAuthorization} from '../services/basicAuthorize';
import {inject} from '@loopback/core';
import {SecurityBindings, UserProfile} from '@loopback/security';

export class AreaController {
  constructor(
    @repository(AreaRepository)
    public areaRepository: AreaRepository,
  ) {}

  @authenticate('jwt')
  @authorize({
    voters: [basicAuthorization],
    allowedRoles: ['admin', 'area-Managment'],
  })
  @post('/areas')
  @response(200, {
    description: 'Area model instance',
    content: {'application/json': {schema: getModelSchemaRef(Area)}},
  })
  async create(
    @inject(SecurityBindings.USER)
    currentUser: UserProfile,
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              name: {type: 'string'},
              province: {type: 'string'},
              district: {type: 'string'},
            },
          },
        },
      },
    })
    area: any,
  ): Promise<any> {
    const {name, province, district} = area;
    if (!name || !province || !district) {
      return {code: 400, message: 'Missing required field'};
    }
    const provinceName = province.split('-')[0].trim();
    const provinceId = province.split('-')[1].trim();
    const districtName = district.split('-')[0].trim();
    const districtId = district.split('-')[1].trim();
    const createdBy = `admin-${currentUser.id}`; // + id admin
    const updatedBy = `admin-${currentUser.id}`; // + id admin
    const createTime = new Date().toLocaleString();
    const newArea = {
      provinceName,
      provinceId,
      districtName,
      districtId,
      name,
      createdBy,
      updatedBy,
      createdAt: createTime,
      updatedAt: createTime,
    };
    const data = await this.areaRepository.create(newArea);
    return {code: 200, data};
  }

  @get('/areas')
  @response(200, {
    description: 'Array of Area model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Area, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(Area) filter?: Filter<Area>): Promise<Area[]> {
    return this.areaRepository.find(filter);
  }

  @get('/areas/{id}')
  @response(200, {
    description: 'Area model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Area, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Area, {exclude: 'where'}) filter?: FilterExcludingWhere<Area>,
  ): Promise<Area> {
    return this.areaRepository.findById(id, filter);
  }

  @authenticate('jwt')
  @authorize({
    voters: [basicAuthorization],
    allowedRoles: ['admin', 'area-Managment'],
  })
  @patch('/areas/{id}')
  @response(204, {
    description: 'Area PATCH success',
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
              name: {type: 'string'},
              province: {type: 'string'},
              district: {type: 'string'},
            },
          },
        },
      },
    })
    area: any,
  ): Promise<any> {
    const {name, province, district} = area;
    let newArea = {};
    if (name) newArea = {...newArea, name};
    if (province) {
      const provinceName = province.split('-')[0].trim();
      const provinceId = province.split('-')[1].trim();
      newArea = {...newArea, provinceName, provinceId};
    }

    if (district) {
      const districtName = district.split('-')[0].trim();
      const districtId = district.split('-')[1].trim();
      newArea = {...newArea, districtName, districtId};
    }

    const updatedBy = `admin-${currentUser.id}`; // + id admin
    const createTime = new Date().toLocaleString();

    await this.areaRepository.updateById(id, {
      ...newArea,
      updatedBy,
      updatedAt: createTime,
    });

    return {
      code: 200,
      data: await this.areaRepository.findById(id),
    };
  }
}
