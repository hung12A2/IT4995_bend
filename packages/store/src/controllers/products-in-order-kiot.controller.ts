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
import {ProductsInOrderKiot} from '../models';
import {ProductsInOrderKiotRepository} from '../repositories';

export class ProductsInOrderKiotController {
  constructor(
    @repository(ProductsInOrderKiotRepository)
    public productsInOrderKiotRepository : ProductsInOrderKiotRepository,
  ) {}

 
  @get('/products-in-order-kiots/count')
  @response(200, {
    description: 'ProductsInOrderKiot model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(ProductsInOrderKiot) where?: Where<ProductsInOrderKiot>,
  ): Promise<Count> {
    return this.productsInOrderKiotRepository.count(where);
  }

  @get('/products-in-order-kiots')
  @response(200, {
    description: 'Array of ProductsInOrderKiot model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(ProductsInOrderKiot, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(ProductsInOrderKiot) filter?: Filter<ProductsInOrderKiot>,
  ): Promise<ProductsInOrderKiot[]> {
    return this.productsInOrderKiotRepository.find(filter);
  }


  @get('/products-in-order-kiots/{id}')
  @response(200, {
    description: 'ProductsInOrderKiot model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(ProductsInOrderKiot, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(ProductsInOrderKiot, {exclude: 'where'}) filter?: FilterExcludingWhere<ProductsInOrderKiot>
  ): Promise<ProductsInOrderKiot> {
    return this.productsInOrderKiotRepository.findById(id, filter);
  }

}
