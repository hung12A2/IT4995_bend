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
import {ReturnOrder} from '../models';
import {ReturnOrderRepository} from '../repositories';

export class ReturnOrderController {
  constructor(
    @repository(ReturnOrderRepository)
    public returnOrderRepository : ReturnOrderRepository,
  ) {}


  @get('/return-orders/count')
  @response(200, {
    description: 'ReturnOrder model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(ReturnOrder) where?: Where<ReturnOrder>,
  ): Promise<Count> {
    return this.returnOrderRepository.count(where);
  }

  @get('/return-orders')
  @response(200, {
    description: 'Array of ReturnOrder model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(ReturnOrder, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(ReturnOrder) filter?: Filter<ReturnOrder>,
  ): Promise<ReturnOrder[]> {
    return this.returnOrderRepository.find(filter);
  }

  @get('/return-orders/{id}')
  @response(200, {
    description: 'ReturnOrder model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(ReturnOrder, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(ReturnOrder, {exclude: 'where'}) filter?: FilterExcludingWhere<ReturnOrder>
  ): Promise<ReturnOrder> {
    return this.returnOrderRepository.findById(id, filter);
  }

}
