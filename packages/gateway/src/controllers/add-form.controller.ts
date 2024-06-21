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
  del,
  requestBody,
  response,
  RestBindings,
  Response,
  Request,
} from '@loopback/rest';
import {inject} from '@loopback/core';
import multer from 'multer';
import FormData from 'form-data';
import storeAxios from '../services/storeAxios.service';
import {authenticate} from '@loopback/authentication';
import {SecurityBindings, UserProfile} from '@loopback/security';

export class AddFormController {
  constructor() {}

  @authenticate('jwt')
  @post('/add-forms')
  @response(200, {
    description: 'AddForm model instance',
    content: {
      'application/json': {
        schema: {
          type: 'object',
        },
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              note: {type: 'string'},
              type: {type: 'string'},
              items: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    idOfProduct: {type: 'string'},
                    quantity: {type: 'number'},
                  },
                },
              },
            },
          },
        },
      },
    })
    addForm: any,
    @inject(SecurityBindings.USER)
    currentUser: UserProfile,
  ): Promise<any> {
    const idOfShop = currentUser?.idOfShop;
    const {note, items, type} = addForm;
    const data = storeAxios
      .post('/add-forms', {
        idOfShop,
        note,
        items,
        type
      })
      .then(res => res)
      .catch(e => console.log(e));
    return data;
  }
  @authenticate('jwt')
  @get('/add-forms/count')
  @response(200, {
    description: 'Array of AddForm model instances',
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
  async count(
    @inject(SecurityBindings.USER)
    currentUser: UserProfile,
    @param.query.object('filter') filter?: any,

  ): Promise<any> {
    const idOfShop = currentUser.idOfShop;
    let where: any;
    if (filter) {
      where = filter?.where || {};
      where = {...where, idOfShop};
      filter.where = where;
    }

    const data = await storeAxios
      .get('/add-forms/count', {
        params: {
          filter,
        },
      })
      .then(res => res)
      .catch(e => console.log(e));

      return data
  }

  @authenticate('jwt')
  @get('/add-forms')
  @response(200, {
    description: 'Array of AddForm model instances',
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
  async find(
    @inject(SecurityBindings.USER)
    currentUser: UserProfile,
    @param.query.object('filter') filter?: any,

  ): Promise<any> {
    const idOfShop = currentUser.idOfShop;
    let where: any;
    if (filter) {
      where = filter?.where || {};
      where = {...where, idOfShop};
      filter.where = where;
    }

    const data = await storeAxios
      .get('/add-forms', {
        params: {
          filter,
        },
      })
      .then(res => res)
      .catch(e => console.log(e));

      return data
  }


  @get('/product-in-add-forms')
  @response(200, {
    description: 'Array of AddForm model instances',
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
  async findProductInAddForm(
    @param.query.object('filter') filter?: any,

  ): Promise<any> {
    const data = await storeAxios
      .get('/product-in-add-forms', {
        params: {
          filter,
        },
      })
      .then(res => res)
      .catch(e => console.log(e));

      return data
  }

  @authenticate('jwt')
  @get('/add-forms/{id}')
  @response(200, {
    description: 'Array of AddForm model instances',
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
  async findById(
    @param.path.string('id') id: string,
    @inject(SecurityBindings.USER)
    currentUser: UserProfile,
  ): Promise<any> {
    let where: any;
  

    const data = await storeAxios
      .get(`/add-forms/${id}`)
      .then(res => res)
      .catch(e => console.log(e));

      return data
  }

  
}
