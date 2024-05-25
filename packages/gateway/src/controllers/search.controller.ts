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

    let products: any = await storeAxios
      .post(`/searches/user/${userId}`, {
        keyWord,
      })
      .then(res => res)
      .catch(err => console.log(err));

    return {shop, products};
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
  async getProductByKey(
    @param.path.string('keyWord') keyWord: string,
  ): Promise<any> {
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

    let products: any = await storeAxios
      .get(`/searches/key/${keyWord}`)
      .then(res => res)
      .catch(err => console.log(err));

    return {shop, products};
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
  ): Promise<any> {
    let filter = {
      where: {
        idOfUser: currentUserProfile.id,
      },
    };

    const data = await storeAxios
      .get(`/searches`, {
        params: {filter},
      })
      .then(res => res)
      .catch(err => console.log(err));
    return data;
  }
}
