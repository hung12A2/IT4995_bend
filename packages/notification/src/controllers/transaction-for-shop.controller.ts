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
import {TransactionShop} from '../models';
import {TransactionShopRepository} from '../repositories';

export class TransactionForShopController {
  constructor(
    @repository(TransactionShopRepository)
    public transactionShopRepository: TransactionShopRepository,
  ) {}

  @get('/transaction-shops')
  @response(200, {
    description: 'Array of TransactionShop model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(TransactionShop, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(TransactionShop) filter?: Filter<TransactionShop>,
  ): Promise<any> {
    const data = await this.transactionShopRepository.find(filter);
    return {
      code:200,
      data
    }
  }
}
