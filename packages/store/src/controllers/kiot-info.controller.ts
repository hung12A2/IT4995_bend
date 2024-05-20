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

  @post('/kiot-infos/{idOfShop}/kiot/{idOfKiot}')
  @response(200, {
    description: 'KiotInfo model instance',
    content: {'application/json': {schema: getModelSchemaRef(KiotInfo)}},
  })
  async create(
   @param.path.string('idOfShop') idOfShop: string,
    @param.path.string('idOfKiot') idOfKiot: string,
  ): Promise<KiotInfo> {
    return this.kiotInfoRepository.create({
      idOfKiot,
      idOfShop,
    });
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

}
