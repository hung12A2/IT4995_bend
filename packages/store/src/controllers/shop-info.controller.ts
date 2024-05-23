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
import {ShopInfo} from '../models';
import {ShopInfoRepository} from '../repositories';

export class ShopInfoController {
  constructor(
    @repository(ShopInfoRepository)
    public shopInfoRepository: ShopInfoRepository,
  ) {}

  @post('/shop-infos/{idOfShop}')
  @response(200, {
    description: 'ShopInfo model instance',
    content: {'application/json': {schema: getModelSchemaRef(ShopInfo)}},
  })
  async create(
    @param.path.string('idOfShop') idOfShop: string,
  ): Promise<ShopInfo> {
    return this.shopInfoRepository.create({idOfShop});
  }

  @get('/shop-infos/count')
  @response(200, {
    description: 'ShopInfo model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(ShopInfo) where?: Where<ShopInfo>): Promise<Count> {
    return this.shopInfoRepository.count(where);
  }

  @get('/shop-infos')
  @response(200, {
    description: 'Array of ShopInfo model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(ShopInfo, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(ShopInfo) filter?: Filter<ShopInfo>,
  ): Promise<ShopInfo[]> {
    return this.shopInfoRepository.find(filter);
  }

  @get('/shop-infos/{idOfShop}')
  @response(200, {
    description: 'ShopInfo model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(ShopInfo, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('idOfShop') idOfShop: string,
  ): Promise<any> {
    return this.shopInfoRepository.findOne({where: {idOfShop}});
  }
}
