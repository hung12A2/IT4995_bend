// Uncomment these imports to begin using these cool features!

// import {inject} from '@loopback/core';
//

import {inject} from '@loopback/core';
import {
  post,
  requestBody,
  get,
  RestBindings,
  Response,
  Request,
  response,
  param,
} from '@loopback/rest';
import axios from '../services/storeAxios.service';
import multer from 'multer';
import {authenticate} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {basicAuthorization} from '../services/basicAuthorize';
import {SecurityBindings, UserProfile} from '@loopback/security';
import FormData from 'form-data';

export class RatingController {
  constructor() {}

  @get('ratings/count', {
    responses: {
      '200': {
        description: 'Return order kiot info',
        content: {
          'application/json': {
            schema: {
              type: 'Product in cart',
            },
          },
        },
      },
    },
  })
  async countAllRatingByShop(
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
    const data = await axios
      .get(`/rating-products/count`, {
        params: {filter},
      })
      .then(res => res)
      .catch(e => console.log(e));

    return data;
  }

  @get('ratings/count', {
    responses: {
      '200': {
        description: 'Return order kiot info',
        content: {
          'application/json': {
            schema: {
              type: 'Product in cart',
            },
          },
        },
      },
    },
  })
  async getAllRatingByShop(
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
    const data = await axios
      .get(`/rating-products/`, {
        params: {filter},
      })
      .then(res => res)
      .catch(e => console.log(e));

    return data;
  }

  @get('ratings/{id}', {
    responses: {
      '200': {
        description: 'Return order kiot info',
        content: {
          'application/json': {
            schema: {
              type: 'Product in cart',
            },
          },
        },
      },
    },
  })
  async getOne(@param.path.string('id') id: string): Promise<any> {
    const data = await axios
      .get(`/rating-products/${id}`)
      .then(res => res)
      .catch(e => console.log(e));

    return data;
  }
}
