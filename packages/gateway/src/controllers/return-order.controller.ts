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
} from '@loopback/rest';

import storeAxios from '../services/storeAxios.service';
import {authenticate} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {basicAuthorization} from '../services/basicAuthorize';
import {inject} from '@loopback/core';
import {SecurityBindings, UserProfile} from '@loopback/security';

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

  @get('/return-ordersForShop/{id}')
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
  async findByIdForShop(@param.path.string('id') id: string): Promise<any> {
    const data = storeAxios
      .get(`/return-orders/${id}`)
      .then(res => res)
      .catch(err => console.log(err));

    return data;
  }

  @authenticate('jwt')
  @authorize({voters: [basicAuthorization], allowedRoles: ['employee']})
  @get('/return-ordersForShop')
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
  async findForShop(
    @inject(SecurityBindings.USER)
    currentUser: UserProfile,
    @param.query.object('filter') filter: any,
  ): Promise<any> {
    const idOfShop = currentUser.idOfShop;

    let where: any;
    if (filter) {
      where = filter?.where || {};
      where = {...where, idOfShop};
      filter.where = where;
    }

    const data = storeAxios
      .get('/return-orders', {params: {filter}})
      .then(res => res)
      .catch(err => console.log(err));

    return data;
  }

  @authenticate('jwt')
  @authorize({voters: [basicAuthorization], allowedRoles: ['employee']})
  @get('/return-ordersForShop/count')
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
  async countForShop(
    @inject(SecurityBindings.USER)
    currentUser: UserProfile,
    @param.query.object('filter') filter: any,
  ): Promise<any> {
    const idOfShop = currentUser.idOfShop;

    let where: any;
    if (filter) {
      where = filter?.where || {};
      where = {...where, idOfShop};
      filter.where = where;
    }

    const data = storeAxios
      .get('/return-orders/count', {params: {filter}})
      .then(res => res)
      .catch(err => console.log(err));

    return data;
  }
}
