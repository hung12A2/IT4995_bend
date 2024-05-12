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
import storeAxios from '../services/storeAxios.service';

export class ProductsInOrderKiotController {
  constructor() {}

  @get('/products-in-order-kiots/count')
  @response(200, {
    description: 'ProductsInOrderKiot model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.query.object('filter') filter?: string): Promise<any> {
    const data = await storeAxios.get('/products-in-order-kiots/count', {
      params: {
        filter,
      },
    });

    return data;
  }

  @get('/products-in-order-kiots')
  @response(200, {
    description: 'ProductsInOrderKiot model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async getAll(@param.query.object('filter') filter?: string): Promise<any> {
    const data = await storeAxios.get('/products-in-order-kiots', {
      params: {
        filter,
      },
    });

    return data;
  }

  @get('/products-in-order-kiots/{id}')
  @response(200, {
    description: 'ProductsInOrderKiot model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async getOne(@param.path.string('id') id: string): Promise<any> {
    const data = await storeAxios.get(`/products-in-order-kiots/${id}`);

    return data;
  }

}
