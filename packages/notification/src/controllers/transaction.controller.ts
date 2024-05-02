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
import {Transaction} from '../models';
import {TransactionRepository} from '../repositories';

export class TransactionController {
  constructor(
    @repository(TransactionRepository)
    public transactionRepository : TransactionRepository,
  ) {}

  @get('/transactions')
  @response(200, {
    description: 'Array of Transaction model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Transaction, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Transaction) filter?: Filter<Transaction>,
  ): Promise<any> {
    const data = await this.transactionRepository.find(filter);
    return {
      code:200,
      data
    }
  }

  
}
