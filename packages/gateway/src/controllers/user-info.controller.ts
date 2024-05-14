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

export class UserInfoController {
  constructor() {}

  @post('/user-infos/{id}')
  @response(200, {
    description: 'UserInfo model instance',
    content: {
      'application/json': {
        schema: {
          type: 'object',
        },
      },
    },
  })
  async create(@param.path.string('id') id: string): Promise<any> {
    const response = await storeAxios
      .post(`/user-infos/${id}`)
      .then(res => res)
      .catch(err => console.log(err));

    return response;
  }

  @get('/user-infos/count')
  @response(200, {
    description: 'UserInfo model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.query.object('filter') filter: string): Promise<any> {
    const data = await storeAxios
      .get('/user-infos/count', {params: {filter}})
      .then(res => res)
      .catch(err => console.log(err));

    return data;
  }

  @get('/user-infos')
  @response(200, {
    description: 'UserInfo model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async find(@param.query.object('filter') filter: string): Promise<any> {
    const data = await storeAxios
      .get('/user-infos', {params: {filter}})
      .then(res => res)
      .catch(err => console.log(err));

    return data;
  }

  @get('/user-infos/{id}')
  @response(200, {
    description: 'UserInfo model instance',
    content: {
      'application/json': {
        schema: {
          type: 'object',
        },
      },
    },
  })
  async findById(@param.path.string('id') id: string): Promise<any> {
    const data = await storeAxios
      .get(`/user-infos/${id}`)
      .then(res => res)
      .catch(err => console.log(err));
    return data;
  }
}
