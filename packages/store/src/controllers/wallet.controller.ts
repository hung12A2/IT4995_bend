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
  RestBindings,
  Response,
  Request,
} from '@loopback/rest';
import {Wallet} from '../models';
import {WalletRepository} from '../repositories';
import {inject} from '@loopback/core';
import {request} from 'http';
import {genUrlVnPay} from '../config/vnPayConfig';
import {RabbitMQService} from '../services/rabbitMqServices';

export class WalletController {
  constructor(
    @repository(WalletRepository)
    public walletRepository: WalletRepository,
    @inject(RestBindings.Http.RESPONSE)
    public response: Response,
    @inject(RestBindings.Http.REQUEST)
    public request: Request,
  ) {}

  newRabbitMQService = RabbitMQService.getInstance();

  @post('/vnPay')
  @response(200, {
    description: 'Wallet model instance',
    content: {'application/json': {schema: getModelSchemaRef(Wallet)}},
  })
  async callVnpay(
    @requestBody({
      description: 'vnpay test',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              amount_money: {type: 'string'},
            },
          },
        },
      },
    })
    request: any,
  ): Promise<any> {
    const ip = this.request.ip;
    const {amount_money} = request;
    return genUrlVnPay(amount_money, ip);
  }

  @post('/wallets/{idOfUser}')
  @response(200, {
    description: 'Wallet model instance',
    content: {'application/json': {schema: getModelSchemaRef(Wallet)}},
  })
  async create(@param.path.string('idOfUser') idOfUser: string): Promise<any> {
    const NewWallet = {
      idOfUser,
    };

    const oldWallet = await this.walletRepository.findOne({where: {idOfUser}});
    if (oldWallet) {
      return {
        code: 400,
        message: 'Wallet already exists',
      };
    } else {
      const data = await this.walletRepository.create(NewWallet);
      return {
        code: 200,
        data,
      };
    }
  }

  @patch('/wallets/{idOfUser}/type/{type}')
  @response(200, {
    description: 'Wallet model instance',
    content: {'application/json': {schema: getModelSchemaRef(Wallet)}},
  })
  async transferMoney(
    @param.path.string('idOfUser') idOfUser: string,
    @param.path.string('type') type: string,
    @requestBody({
      content: {
        'application/json': {
          schema: {
            properties: {
              amountMoney: {type: 'number'},
            },
          },
        },
      },
    })
    request: any,
  ): Promise<any> {
    const {amountMoney} = request;
    const oldWallet: any = await this.walletRepository.findOne({
      where: {idOfUser},
    });
    if (type == 'receive') {
      await this.walletRepository.updateAll(
        {amountMoney: amountMoney + oldWallet?.amountMoney},
        {idOfUser},
      );
    } else if (type == 'send') {
      if (oldWallet?.amountMoney < amountMoney) {
        return {
          code: 400,
          message: 'Not enough money',
        };
      } else {
        await this.walletRepository.updateAll(
          {amountMoney: oldWallet?.amountMoney - amountMoney},
          {idOfUser},
        );
      }
    } else if (type == 'charge') {
      await this.walletRepository.updateAll(
        {amountMoney: amountMoney + oldWallet?.amountMoney},
        {idOfUser},
      );

      const dataTransaction = JSON.stringify({
        idOfUser,
        amountMoney: amountMoney,
        type: 'charge',
        createdAt: new Date().toLocaleString(),
        idOfOrder: idOfUser,
      });

      (await this.newRabbitMQService).sendMessageToTopicExchange(
        'transaction',
        'create',
        dataTransaction,
      );

      const dataNoti = JSON.stringify({
        idOfUser,
        content: `nap thanh cong ${amountMoney} VND`,
        createdAt: new Date().toLocaleString(),
      });

      (await this.newRabbitMQService).sendMessageToTopicExchange(
        'notification',
        'create',
        dataNoti,
      );
    }

    const data = await this.walletRepository.findOne({where: {idOfUser}});
    return {code: 200, data};
  }

  @get('/wallets/{idOfUser}')
  @response(200, {
    description: 'Wallet model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Wallet, {includeRelations: true}),
      },
    },
  })
  async getWallet(
    @param.path.string('idOfUser') idOfUser: string,
  ): Promise<any> {
    return this.walletRepository.findOne({where: {idOfUser}});
  }
}
