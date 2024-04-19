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

export class AreaController {
  constructor(
    @repository(AreaRepository)
    public areaRepository: AreaRepository,
  ) {}

  @post('/areas')
  @response(200, {
    description: 'Area model instance',
    content: {'application/json': {schema: getModelSchemaRef(Area)}},
  })
  async create(
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
    const provinceName = province.split('-')[0].trim();
    const provinceId = province.split('-')[1].trim();
    const districtName = district.split('-')[0].trim();
    const districtId = district.split('-')[1].trim();
    const createdBy = 'admin'; // + id admin
    const updatedBy = 'admin'; // + id admin
    const createTime = new Date().toDateString();
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
    return this.areaRepository.create(newArea);
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

  @patch('/areas/{id}')
  @response(204, {
    description: 'Area PATCH success',
  })
  async updateById(
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
  ): Promise<void> {
    const {name, province, district} = area;
    const provinceName = province.split('-')[0].trim();
    const provinceId = province.split('-')[1].trim();
    const districtName = district.split('-')[0].trim();
    const districtId = district.split('-')[1].trim();
    const updatedBy = 'admin'; // + id admin
    const createTime = new Date().toDateString();
    const newArea = {
      provinceName,
      provinceId,
      districtName,
      districtId,
      name,
      updatedBy,
      updatedAt: createTime,
    };
    await this.areaRepository.updateById(id, newArea);
  }
}
