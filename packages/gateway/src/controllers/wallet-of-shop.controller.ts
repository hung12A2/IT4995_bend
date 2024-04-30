// Uncomment these imports to begin using these cool features!

// import {inject} from '@loopback/core';

//WalletOfUserController

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
import {authenticate} from '@loopback/authentication';
import storeAxios from '../services/storeAxios.service';
import multer from 'multer';
import FormData from 'form-data';
import {authorize} from '@loopback/authorization';
import {basicAuthorization} from '../services/basicAuthorize';
import {SecurityBindings, UserProfile} from '@loopback/security';

const storage = multer.memoryStorage();
const upload = multer({storage});

var cpUpload = upload.fields([{name: 'images'}]);
// import {inject} from '@loopback/core';

export class WalletOfShopController {
  constructor(
    @inject(RestBindings.Http.RESPONSE) public response: Response,
    @inject(RestBindings.Http.REQUEST) public request: Request,
  ) {}


  @post('wallet-of-shop/create/{idOfShop}', {
    responses: {
      '200': {
        description: 'Return new wallet of shop',
        content: {
          'application/json': {
            schema: {
              type: 'Wallet Of shop',
            },
          },
        },
      },
    },
  })
  async createWallet(
    @param.path.string('idOfShop') idOfShop: string,
  ): Promise<any> {
    const data = await storeAxios
      .post(`/wallet-of-shops/${idOfShop}`)
      .then(res => res)
      .catch(e => console.log(e));

    return data;
  }

  @post('wallet-of-shop/update/{idOfShop}', {
    responses: {
      '200': {
        description: 'Return new wallet of shop',
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
      },
    },
  })
  async updateWallet(
    @param.path.string('idOfShop') idOfShop: string,
    @requestBody({
      content: {
        'application/json': {
          schema: {
            properties: {
              type: {type: 'string'},
              amountMoney: {type: 'number'},
            },
          },
        },
      },
    })
    req: any,
  ): Promise<any> {
    const {type, amountMoney} = req;
    if (!type || !amountMoney) {
      return {
        code: 400,
        message: 'Bad request',
      };
    }
    const data = await storeAxios
      .patch(`/wallet-of-shops/${idOfShop}/type/${type}`, {amountMoney}, {})
      .then(res => res)
      .catch(e => console.log(e));

    return data;
  }
}
