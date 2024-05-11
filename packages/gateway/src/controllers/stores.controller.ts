import {inject} from '@loopback/core';
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
  RestBindings,
  Request,
  Response,
} from '@loopback/rest';

import axios from '../services/authAxios.service';
import {authenticate} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {basicAuthorization} from '../services/basicAuthorize';

export class StoresController {
  constructor(
    @inject(RestBindings.Http.REQUEST) public request: Request,
    @inject(RestBindings.Http.RESPONSE) public response: Response,
  ) {}

  // for admin + user
  @get('/stores')
  @response(200, {
    description: 'Array of Store model instances',
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
    const data = await axios
      .get('/stores', {params: {filter}})
      .then(res => res)
      .catch(e => console.log(e));
    return data;
  }

  @get('/stores/count')
  @response(200, {
    description: 'Array of Store model instances',
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
  async count(@param.query.object('filter') filter: string): Promise<any> {
    const data = await axios
      .get('/stores/count', {params: {filter}})
      .then(res => res)
      .catch(e => console.log(e));
    return data;
  }

  // for admin + store owner
  // tim day du thong tin shop cua minh
  // tim thong tin shop nguoi khac bang filter
  @get('/stores/{id}')
  @response(200, {
    description: 'Array of Store model instances',
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
  async getOne(@param.path.string('id') id: string): Promise<any> {
    const data = await axios
      .get(`/stores/${id}`)
      .then(res => res)
      .catch(e => console.log(e));
    return data;
  }

  // for store owner update store info
  // for admin update permission of store
  @authenticate('jwt')
  @authorize({voters: [basicAuthorization], allowedRoles: ['customer']})
  @patch('/stores/{id}')
  @response(204, {
    description: 'Store PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
          },
        },
      },
    })
    store: any,
  ): Promise<any> {
    const data = await axios
      .patch(`/stores/${id}`, {...store})
      .then(res => res)
      .catch(e => console.log(e));

    return data;
  }

  // for store owner
  @authenticate('jwt')
  @authorize({voters: [basicAuthorization], allowedRoles: ['customer']})
  @patch('/stores/stopWorking/{id}')
  @response(204, {
    description: 'Store stopWorking success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<any> {
    const data = await axios.patch(`/stores/stopWorking/${id}`).then(res => res);
    return data
  }

  // for admin
  @authenticate('jwt')
  @authorize({voters: [basicAuthorization], allowedRoles: ['admin']})
  @post('/stores/banned/{id}')
  @response(204, {
    description: 'Store Banned success',
  })
  async BanedById(@param.path.string('id') id: string): Promise<any> {
    const data = await axios.post(`/stores/banned/${id}`).then(res => res);
    return data; 
  }
  @authenticate('jwt')
  @authorize({voters: [basicAuthorization], allowedRoles: ['admin']})
  @post('/stores/unbanned/{id}')
  @response(204, {
    description: 'Store Banned success',
  })
  async Unbanned(@param.path.string('id') id: string): Promise<any> {
    const data = await axios.post(`/stores/unbanned/${id}`).then(res => res);
    return data; 
  }
}
