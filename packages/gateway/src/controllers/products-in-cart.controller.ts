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

// import {inject} from '@loopback/core';

export class ProductsInCartController {
  constructor(
    @inject(RestBindings.Http.RESPONSE) public response: Response,
    @inject(RestBindings.Http.REQUEST) public request: Request,
  ) {}

  @authenticate('jwt')
  @authorize({voters: [basicAuthorization], allowedRoles: ['customer']})
  @post('product-in-carts/create/{idOfProduct}', {
    responses: {
      '200': {
        description: 'Return location info',
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
  async addProductToCart(
    @inject(SecurityBindings.USER)
    currentUser: UserProfile,
    @param.path.string('idOfProduct') idOfProduct: string,
    @requestBody({
      description: 'add products to cart',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              quantity: {type: 'number'},
              isKiot: {type: 'boolean'},
            },
          },
        },
      },
    })
    request: any,
  ): Promise<any> {
    const idOfUser = currentUser.id;
    const {quantity, isKiot} = request;

    const data = await axios.post(
      `/carts/user/${idOfUser}/product/${idOfProduct}`,
      {quantity, isKiot},
    );

    return data
  }

  @authenticate('jwt')
  @authorize({voters: [basicAuthorization], allowedRoles: ['customer']})
  @post('product-in-carts/getKiot', {
    responses: {
      '200': {
        description: 'Return location info',
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
  async getProductKiot(
    @inject(SecurityBindings.USER)
    currentUser: UserProfile,
  ): Promise<any> {
    const idOfUser = currentUser.id;

    const data = await axios.get(
      `/carts/user/${idOfUser}/kiot`,
    );

    return data
  }

  @authenticate('jwt')
  @authorize({voters: [basicAuthorization], allowedRoles: ['customer']})
  @post('product-in-carts/getOnline', {
    responses: {
      '200': {
        description: 'Return location info',
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
  async getProductOnline(
    @inject(SecurityBindings.USER)
    currentUser: UserProfile,
  ): Promise<any> {
    const idOfUser = currentUser.id;

    const data = await axios.get(
      `/carts/user/${idOfUser}/online`,
    );

    return data
  }
}
