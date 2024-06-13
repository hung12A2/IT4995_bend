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

  @authenticate('jwt')
  @post('wallet-of-user/update/', {
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
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
    @requestBody({
      content: {
        'application/json': {
          schema: {
            properties: {
              type: {type: 'string'},
              amountMoney: {type: 'number'},
              vnpayCode: {type: 'string'},
            },
          },
        },
      },
    })
    req: any,
  ): Promise<any> {
    const idOfUser = currentUserProfile.id;
    const {type, amountMoney} = req;
    const vnpayCode = req?.vnpayCode;
    if (!type || !amountMoney) {
      return {
        code: 400,
        message: 'Bad request',
      };
    }

    if (vnpayCode) {
      const data = await storeAxios
        .patch(
          `/wallets/${idOfUser}/type/${type}`,
          {amountMoney, vnpayCode},
          {
            headers: {
              authorization: this.request.headers.authorization,
            },
          },
        )
        .then(res => res)
        .catch(e => console.log(e));

      return data;
    } else {
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

  @authenticate('jwt')
  @get('/wallet-of-user/')
  @response(200, {
    description: 'Wallet model instance',
    content: {
      'application/json': {
        schema: {
          type: 'object',
        },
      },
    },
  })
  async getWallet(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<any> {
    const data = await storeAxios
      .get(`/wallets/${currentUserProfile.id}`)
      .then(res => res)
      .catch(e => console.log(e));

    return data;
  }

  @post('/vnPay')
  @response(200, {
    description: 'Wallet model instance',
    content: {
      'application/json': {
        schema: {
          type: 'object',
        },
      },
    },
  })
  async vnPay(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            properties: {
              amount_money: {type: 'string'},
            },
          },
        },
      },
    })
    req: any,
  ): Promise<any> {
    const {amount_money} = req;

    const data = await storeAxios
      .post(`/vnPay`, {
        amount_money,
      })
      .then(res => res)
      .catch(e => console.log(e));

    return data;
  }
}
