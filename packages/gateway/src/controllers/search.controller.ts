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

import authAxios from '../services/authAxios.service';
import storeAxios from '../services/storeAxios.service';
import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {SecurityBindings} from '@loopback/security';
import axios from 'axios';

export class SearchController {
  constructor() {}

  @authenticate('jwt')
  @post('/searches/')
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
    @inject(SecurityBindings.USER) currentUserProfile: any,
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              keyWord: {type: 'string'},
            },
          },
        },
      },
    })
    search: any,
  ): Promise<any> {
    const userId = currentUserProfile.id;
    const keyWord = search.keyWord;

    let products: any = await storeAxios
      .post(`/searches/user/${userId}`, {
        keyWord,
      })
      .then(res => res)
      .catch(err => console.log(err));

    return products;
  }

  @get('/searches/{keyWord}')
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
  async getByKey(@param.path.string('keyWord') keyWord?: string): Promise<any> {
    let shop: any = await authAxios
      .get(`searches/${keyWord}`)
      .then(res => res)
      .catch(e => console.log(e));
    if (shop.length > 0) {
      shop = await Promise.all(
        shop.map(async (item: any) => {
          const idOfShop = item.id;
          const data: any = await storeAxios
            .get(`/shop-infos/${idOfShop}`)
            .then(res => res)
            .catch(err => console.log(err));
          return {
            ...item,
            numberOfProduct: data.numberOfProduct,
            numberOfOrder: data.numberOfOrder,
            numberOfRating: data.numberOfRating,
            avgRating: data.avgRating,
            numberOfSold: data.numberOfSold,
          };
        }),
      );
    }

    let kiot: any = await authAxios
      .get(`/searchesKiot/${keyWord}`)
      .then(res => res)
      .catch(e => console.log(e));
    if (kiot.length > 0) {
      kiot = await Promise.all(
        kiot.map(async (item: any) => {
          const idOfKiot = item.id;
          const data: any = await storeAxios
            .get(`/kiot-infos`, {
              params: {
                filter: {
                  where: {
                    idOfKiot,
                  },
                },
              },
            })
            .then((res: any) => res[0])
            .catch(err => console.log(err));

          return {
            ...item,
            numberOfProduct: data.numberOfProduct,
            numberOfOrder: data.numberOfOrder,
            numberOfRating: data.numberOfRating,
            avgRating: data.avgRating,
            numberOfSold: data.numberOfSold,
          };
        }),
      );
    }

    let products: any = await storeAxios
      .get(`/searches/key/${keyWord}`)
      .then(res => res)
      .catch(err => console.log(err));

    return {shop, kiot, products};
  }

  @get('/searchesProduct/{keyWord}')
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
  async getProductByKey(
    @param.query.object('filter') filter: any,
    @param.path.string('keyWord') keyWord: string,
  ): Promise<any> {
    let products: any = await storeAxios
      .get(`/searches/key/${keyWord}`, {
        params: {filter},
      })
      .then(res => res)
      .catch(err => console.log(err));

    return products;
  }

  @authenticate('jwt')
  @get('/searches')
  @response(200, {
    description: 'Array of Search model instances',
    content: {
      'application/json': {
        schema: {
          type: 'object',
        },
      },
    },
  })
  async findByUser(
    @inject(SecurityBindings.USER) currentUserProfile: any,
    @param.query.object('filter') filter: any,
  ): Promise<any> {
    const idOfUser = currentUserProfile.id;
    let where: any;
    if (filter) {
      where = filter?.where || {};
      where = {...where, idOfUser};
      filter.where = where;
    }

    const data = await storeAxios
      .get(`/searches`, {
        params: {filter},
      })
      .then(res => res)
      .catch(err => console.log(err));
    return data;
  }

  @get('/searchesAll')
  @response(200, {
    description: 'Array of Search model instances',
    content: {
      'application/json': {
        schema: {
          type: 'object',
        },
      },
    },
  })
  async findAll(
    @param.query.object('filter') filter: any,
  ): Promise<any> {
    const data = await storeAxios
      .get(`/searches`, {
        params: {filter},
      })
      .then(res => res)
      .catch(err => console.log(err));
    return data;
  }


  @post('/suggestForUser')
  @response(200, {
    description: 'Array of Search model instances',
    content: {
      'application/json': {
        schema: {
          type: 'object',
        },
      },
    },
  })
  async suggest(
    @requestBody({
      description: 'Search model instance',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              listKeyWord: {
                type: 'array',
                items: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    })
    req: any,
  ): Promise<any> {
    const listKeyWord = req.listKeyWord;

    const dataReturn = await axios
      .post(`suggestForUser`, {
        listKeyWord,
      })
      .then(res => res)
      .catch(e => console.log(e));

    return dataReturn;
  }
}
