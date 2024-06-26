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

import notificationAxios from '../services/notificationAxios.service';

export class TransactionController {
  constructor() {}

  @get('/transactions/count')
  @response(200, {
    description: 'Transaction model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.query.object('filter') filter: string): Promise<any> {
    const data = notificationAxios
      .get('/transactions/count', {params: {filter}})
      .then(res => res)
      .catch(err => console.log(err));
    return data;
  }

  @get('/transactions')
  @response(200, {
    description: 'Transaction model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async getAll(
    @param.query.object('filter') filter?: string,
  ): Promise<any> {
    const data = notificationAxios
      .get('/transactions', {params: {filter}})
      .then(res => res)
      .catch(err => console.log(err));
    return data;
  }

  @get('/transactions/{id}')
  @response(200, {
    description: 'Transaction model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async getOne(@param.path.string('id') id: string): Promise<any> {
    const data = notificationAxios
      .get(`/transactions/${id}`)
      .then(res => res)
      .catch(err => console.log(err));

    return data;
  }
}
