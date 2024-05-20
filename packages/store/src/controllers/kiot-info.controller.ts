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
import {KiotInfo} from '../models';
import {KiotInfoRepository} from '../repositories';

export class KiotInfoController {
  constructor(
    @repository(KiotInfoRepository)
    public kiotInfoRepository : KiotInfoRepository,
  ) {}

  @post('/kiot-infos')
  @response(200, {
    description: 'KiotInfo model instance',
    content: {'application/json': {schema: getModelSchemaRef(KiotInfo)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(KiotInfo, {
            title: 'NewKiotInfo',
            exclude: ['id'],
          }),
        },
      },
    })
    kiotInfo: Omit<KiotInfo, 'id'>,
  ): Promise<KiotInfo> {
    return this.kiotInfoRepository.create(kiotInfo);
  }

  @get('/kiot-infos/count')
  @response(200, {
    description: 'KiotInfo model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(KiotInfo) where?: Where<KiotInfo>,
  ): Promise<Count> {
    return this.kiotInfoRepository.count(where);
  }

  @get('/kiot-infos')
  @response(200, {
    description: 'Array of KiotInfo model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(KiotInfo, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(KiotInfo) filter?: Filter<KiotInfo>,
  ): Promise<KiotInfo[]> {
    return this.kiotInfoRepository.find(filter);
  }

  @patch('/kiot-infos')
  @response(200, {
    description: 'KiotInfo PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(KiotInfo, {partial: true}),
        },
      },
    })
    kiotInfo: KiotInfo,
    @param.where(KiotInfo) where?: Where<KiotInfo>,
  ): Promise<Count> {
    return this.kiotInfoRepository.updateAll(kiotInfo, where);
  }

  @get('/kiot-infos/{id}')
  @response(200, {
    description: 'KiotInfo model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(KiotInfo, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(KiotInfo, {exclude: 'where'}) filter?: FilterExcludingWhere<KiotInfo>
  ): Promise<KiotInfo> {
    return this.kiotInfoRepository.findById(id, filter);
  }

  @patch('/kiot-infos/{id}')
  @response(204, {
    description: 'KiotInfo PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(KiotInfo, {partial: true}),
        },
      },
    })
    kiotInfo: KiotInfo,
  ): Promise<void> {
    await this.kiotInfoRepository.updateById(id, kiotInfo);
  }

  @put('/kiot-infos/{id}')
  @response(204, {
    description: 'KiotInfo PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() kiotInfo: KiotInfo,
  ): Promise<void> {
    await this.kiotInfoRepository.replaceById(id, kiotInfo);
  }

  @del('/kiot-infos/{id}')
  @response(204, {
    description: 'KiotInfo DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.kiotInfoRepository.deleteById(id);
  }
}
