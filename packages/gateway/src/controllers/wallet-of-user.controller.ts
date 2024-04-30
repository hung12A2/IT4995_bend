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

export class WalletOfUserController {
  constructor(
    @inject(RestBindings.Http.RESPONSE) public response: Response,
    @inject(RestBindings.Http.REQUEST) public request: Request,
  ) {}


  @post('wallet-of-user/create/{idOfUser}', {
    responses: {
      '200': {
        description: 'Return new wallet of user',
        content: {
          'application/json': {
            schema: {
              type: 'PRODUCT',
            },
          },
        },
      },
    },
  })
  async createWallet(
    @param.path.string('idOfUser') idOfUser: string,
  ): Promise<any> {
    const data = await storeAxios
      .post(`/wallets/${idOfUser}`)
      .then(res => res)
      .catch(e => console.log(e));

    return data;
  }

  @post('wallet-of-user/update/{idOfUser}', {
    responses: {
      '200': {
        description: 'Return new wallet of user',
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
    @param.path.string('idOfUser') idOfUser: string,
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
      .patch(
        `/wallets/${idOfUser}/type/${type}`,
        {amountMoney},
        {
          headers: {
            authorization: this.request.headers.authorization,
          },
        },
      )
      .then(res => res)
      .catch(e => console.log(e));

    return data;
  }
}
