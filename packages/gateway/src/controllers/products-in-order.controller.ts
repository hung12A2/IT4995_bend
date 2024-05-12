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

export class ProductsInOrderController {
  constructor() {}

  @get('/products-in-orders/count')
  @response(200, {
    description: 'ProductsInOrder model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.query.object('filter') filter: string): Promise<any> {
    const data = storeAxios.get('/products-in-orders/count', {
      params: {filter},
    });
    return data;
  }

  @get('/products-in-orders')
  @response(200, {
    description: 'ProductsInOrder model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async getAll(@param.query.object('filter') filter: string): Promise<any> {
    const data = storeAxios.get('/products-in-orders', {params: {filter}});
    return data;
  }

  @get('/products-in-orders/{id}')
  @response(200, {
    description: 'ProductsInOrder model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async getOne(@param.path.string('id') id: string): Promise<any> {
    const data = storeAxios.get(`/products-in-orders/${id}`);
    return data;
  }

}
