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

export class KiotInfoController {
  constructor() {}

  @post('/kiot-infos/{idOfShop}/kiot/{idOfKiot}')
  @response(200, {
    description: 'ShopInfo model instance',
    content: {
      'application/json': {
        schema: {
          type: 'object',
        },
      },
    },
  })
  async create(
    @param.path.string('idOfShop') idOfShop: string,
    @param.path.string('idOfKiot') idOfKiot: string,
  ): Promise<any> {
    const data = storeAxios
      .post(`/kiot-infos/${idOfShop}/kiot/${idOfKiot}`)
      .then(res => res)
      .catch(err => console.log(err));

    return data;
  }

  @get('/kiot-infos/count')
  @response(200, {
    description: 'ShopInfo model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.query.object('filter') filter: string): Promise<any> {
    const data = storeAxios
      .get('/kiot-infos/count', {params: {filter}})
      .then(res => res)
      .catch(err => console.log(err));

    return data;
  }

  @get('/kiot-infos')
  @response(200, {
    description: 'Array of ShopInfo model instances',
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
      .get('/kiot-infos', {params: {filter}})
      .then(res => res)
      .catch(err => console.log(err));

    return data;
  }

  @get('/kiot-infos/{id}')
  @response(200, {
    description: 'ShopInfo model instance',
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
      .get(`/kiot-infos/${id}`)
      .then(res => res)
      .catch(err => console.log(err));

    return data;
  }
}
