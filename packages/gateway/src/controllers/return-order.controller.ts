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

export class ReturnOrderController {
  constructor() {}

  @get('/return-orders/count')
  @response(200, {
    description: 'ReturnOrder model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.query.object('filter') filter: string): Promise<any> {
    const data = storeAxios
      .get('/return-orders/count', {params: {filter}})
      .then(res => res)
      .catch(err => console.log(err));

    return data;
  }

  @get('/return-orders')
  @response(200, {
    description: 'Array of ReturnOrder model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: {
            type: 'object',
          },
        },
      },
    },
  })
  async find(@param.query.object('filter') filter: string): Promise<any> {
    const data = storeAxios
      .get('/return-orders', {params: {filter}})
      .then(res => res)
      .catch(err => console.log(err));

    return data;
  }

  @get('/return-orders/{id}')
  @response(200, {
    description: 'ReturnOrder model instance',
    content: {
      'application/json': {
        schema: {
          type: 'object',
        },
      },
    },
  })
  async findById(@param.path.string('id') id: string): Promise<any> {
    const data = storeAxios
      .get(`/return-orders/${id}`)
      .then(res => res)
      .catch(err => console.log(err));

    return data;
  }
}
