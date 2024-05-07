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
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ShopInfo, {
            title: 'NewShopInfo',
            exclude: ['id'],
          }),
        },
      },
    })
    shopInfo: Omit<ShopInfo, 'id'>,
  ): Promise<ShopInfo> {
    return this.shopInfoRepository.create(shopInfo);
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

  @get('/shop-infos/{id}')
  @response(200, {
    description: 'ShopInfo model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(ShopInfo, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(ShopInfo, {exclude: 'where'})
    filter?: FilterExcludingWhere<ShopInfo>,
  ): Promise<ShopInfo> {
    return this.shopInfoRepository.findById(id, filter);
  }
}
