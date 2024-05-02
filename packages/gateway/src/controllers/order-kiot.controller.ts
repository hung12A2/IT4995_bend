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

export class OrderKiotController {
  constructor(
    @inject(RestBindings.Http.RESPONSE) public response: Response,
    @inject(RestBindings.Http.REQUEST) public request: Request,
  ) {}

  @authenticate('jwt')
  @authorize({
    voters: [basicAuthorization],
    allowedRoles: ['employee', 'orderKiot-Managment'],
  })
  @post('order-kiot/create', {
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
  async addProductToCart(
    @inject(SecurityBindings.USER)
    currentUser: UserProfile,
    @requestBody({
      description: 'add products to cart',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              fromName: {type: 'string'},
              toName: {type: 'string'},
              fromPhone: {type: 'string'},
              toPhone: {type: 'string'},
              fromAddress: {type: 'string'},
              toAddress: {type: 'string'},
              fromProvince: {type: 'string'},
              toProvince: {type: 'string'},
              fromDistrict: {type: 'string'},
              toDistrict: {type: 'string'},
              fromWard: {type: 'string'},
              toWard: {type: 'string'},
              content: {type: 'string'},
              priceOfAll: {type: 'number'},
              paymentMethod: {type: 'string'},
              note: {type: 'string'},
              requiredNote: {type: 'string'},
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
    request: any,
  ): Promise<any> {
    
  }
}
