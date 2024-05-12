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

export class TransactionforshopController {
  constructor(
    @repository(TransactionShopRepository)
    public transactionShopRepository : TransactionShopRepository,
  ) {}

  @post('/transaction-shops')
  @response(200, {
    description: 'TransactionShop model instance',
    content: {'application/json': {schema: getModelSchemaRef(TransactionShop)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TransactionShop, {
            title: 'NewTransactionShop',
            exclude: ['id'],
          }),
        },
      },
    })
    transactionShop: Omit<TransactionShop, 'id'>,
  ): Promise<TransactionShop> {
    return this.transactionShopRepository.create(transactionShop);
  }

  @get('/transaction-shops/count')
  @response(200, {
    description: 'TransactionShop model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(TransactionShop) where?: Where<TransactionShop>,
  ): Promise<Count> {
    return this.transactionShopRepository.count(where);
  }

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
  ): Promise<TransactionShop[]> {
    return this.transactionShopRepository.find(filter);
  }

  @patch('/transaction-shops')
  @response(200, {
    description: 'TransactionShop PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TransactionShop, {partial: true}),
        },
      },
    })
    transactionShop: TransactionShop,
    @param.where(TransactionShop) where?: Where<TransactionShop>,
  ): Promise<Count> {
    return this.transactionShopRepository.updateAll(transactionShop, where);
  }

  @get('/transaction-shops/{id}')
  @response(200, {
    description: 'TransactionShop model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(TransactionShop, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(TransactionShop, {exclude: 'where'}) filter?: FilterExcludingWhere<TransactionShop>
  ): Promise<TransactionShop> {
    return this.transactionShopRepository.findById(id, filter);
  }

  @patch('/transaction-shops/{id}')
  @response(204, {
    description: 'TransactionShop PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TransactionShop, {partial: true}),
        },
      },
    })
    transactionShop: TransactionShop,
  ): Promise<void> {
    await this.transactionShopRepository.updateById(id, transactionShop);
  }

  @put('/transaction-shops/{id}')
  @response(204, {
    description: 'TransactionShop PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() transactionShop: TransactionShop,
  ): Promise<void> {
    await this.transactionShopRepository.replaceById(id, transactionShop);
  }

  @del('/transaction-shops/{id}')
  @response(204, {
    description: 'TransactionShop DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.transactionShopRepository.deleteById(id);
  }
}
