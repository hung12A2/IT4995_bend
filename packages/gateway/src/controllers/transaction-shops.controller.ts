// Uncomment these imports to begin using these cool features!

// import {inject} from '@loopback/core';


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

export class transactionShopsController {
  constructor() {}

  @get('/transaction-shops/count')
  @response(200, {
    description: 'Transaction model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.query.object('filter') filter: string): Promise<any> {
    const data = notificationAxios
      .get('/transaction-shops/count', {params: {filter}})
      .then(res => res)
      .catch(err => console.log(err));
    return data;
  }

  @get('/transaction-shops')
  @response(200, {
    description: 'Transaction model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async getAll(@param.query.object('filter') filter: string): Promise<any> {
    console.log(filter);
    const data = notificationAxios
      .get('/transaction-shops', {params: {filter}})
      .then(res => res)
      .catch(err => console.log(err));
    return data;
  }

  @get('/transaction-shops/{id}')
  @response(200, {
    description: 'Transaction model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async getOne(@param.path.string('id') id: string): Promise<any> {
    const data = notificationAxios
      .get(`/transaction-shops/${id}`)
      .then(res => res)
      .catch(err => console.log(err));

    return data;
  }
}
