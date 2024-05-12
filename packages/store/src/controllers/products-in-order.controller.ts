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
import {ProductsInOrder} from '../models';
import {ProductsInOrderRepository} from '../repositories';

export class ProductsInOrderController {
  constructor(
    @repository(ProductsInOrderRepository)
    public productsInOrderRepository : ProductsInOrderRepository,
  ) {}

  @get('/products-in-orders/count')
  @response(200, {
    description: 'ProductsInOrder model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(ProductsInOrder) where?: Where<ProductsInOrder>,
  ): Promise<Count> {
    return this.productsInOrderRepository.count(where);
  }

  @get('/products-in-orders')
  @response(200, {
    description: 'Array of ProductsInOrder model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(ProductsInOrder, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(ProductsInOrder) filter?: Filter<ProductsInOrder>,
  ): Promise<ProductsInOrder[]> {
    return this.productsInOrderRepository.find(filter);
  }

  @get('/products-in-orders/{id}')
  @response(200, {
    description: 'ProductsInOrder model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(ProductsInOrder, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(ProductsInOrder, {exclude: 'where'}) filter?: FilterExcludingWhere<ProductsInOrder>
  ): Promise<ProductsInOrder> {
    return this.productsInOrderRepository.findById(id, filter);
  }

}
