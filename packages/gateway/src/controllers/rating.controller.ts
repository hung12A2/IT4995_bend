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
import authAxios from '../services/authAxios.service';
import multer from 'multer';
import {authenticate} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {basicAuthorization} from '../services/basicAuthorize';
import {SecurityBindings, UserProfile} from '@loopback/security';
import FormData from 'form-data';
import {request} from 'http';

export class RatingController {
  constructor(@inject(RestBindings.Http.REQUEST) public request: Request) {}

  @authenticate('jwt')
  @authorize({voters: [basicAuthorization], allowedRoles: ['employee']})
  @get('ratingsForShop/count', {
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

  @authenticate('jwt')
  @authorize({voters: [basicAuthorization], allowedRoles: ['employee']})
  @get('ratingsForShop', {
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

  @get('ratings', {
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
  async getAll(@param.query.object('filter') filter?: any): Promise<any> {
    let data: any = await axios
      .get(`/rating-products/`, {
        params: {filter},
      })
      .then(res => res)
      .catch(e => console.log(e));

    const listIdUser = data.map((item: any) => item.idOfUser);

    let dataUser:any = await authAxios.get(`getAllUser`, {
      params: {
        filter: {
          where: {
            id: {inq: listIdUser},
          },
        },
      },
      headers: {
        authorization: this.request.headers.authorization,
      },
    });


    data = data.map((item: any) => {
      const user = dataUser.find((user: any) => user.id === item.idOfUser);
      return {
        ...item,
        userAvatar: user.avatar,
        userName: user.fullName,
      };
    });

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
  async getOneFroAll(@param.query.object('filter') filter?: any): Promise<any> {
    const data = await axios
      .get(`/rating-products/count`, {
        params: {filter},
      })
      .then(res => res)
      .catch(e => console.log(e));

    return data;
  }

  @authenticate('jwt')
  @post('ratings', {
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
  async create(
    @requestBody({
      description: 'Rating product',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              rating: {type: 'number'},
              comment: {type: 'string'},
              idOfProduct: {type: 'string'},
              isKiot: {type: 'boolean'},
              idOfOrder: {type: 'string'},
              idOfKiot: {type: 'string'},
              idOfShop: {type: 'string'},
            },
          },
        },
      },
    })
    request: any,
  ): Promise<any> {
    const {
      rating,
      comment,
      idOfProduct,
      idOfOrder,
      idOfKiot,
      isKiot,
      idOfShop,
    } = request;

    let dataRequest = {
      rating,
      comment,
      isKiot,
      idOfKiot,
      idOfShop,
    };

    const data = await axios
      .post(
        `/rating-products/order/${idOfOrder}/product/${idOfProduct}`,
        dataRequest,
      )
      .then(res => res)
      .catch(e => console.log(e));

    return data;
  }

  @get('ratingsForShop/{id}', {
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
