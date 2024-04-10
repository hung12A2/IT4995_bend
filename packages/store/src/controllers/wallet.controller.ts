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
} from '@loopback/rest';
import {Wallet} from '../models';
import {WalletRepository} from '../repositories';
import {inject} from '@loopback/core';

export class WalletController {
  constructor(
    @repository(WalletRepository)
    public walletRepository: WalletRepository,
    @inject(RestBindings.Http.RESPONSE)
    public response: Response,
  ) {}

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
      return this.response.status(400).send({message: 'Wallet already exists'});
    } else {
      return this.walletRepository.create(NewWallet);
    }
  }

  @patch('/wallets/{idOfUser}')
  @response(200, {
    description: 'Wallet model instance',
    content: {'application/json': {schema: getModelSchemaRef(Wallet)}},
  })
  async updateMoney(
    @param.path.string('idOfUser') idOfUser: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Wallet, {partial: true}),
        },
      },
    })
    request: any,
  ): Promise<any> {
    const {amountMoney} = request;
    await this.walletRepository.updateAll({amountMoney}, {idOfUser});
    return this.walletRepository.findOne({where: {idOfUser}});
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
    const oldWallet: any = await this.walletRepository.findOne({where: {idOfUser}});
    if (type == 'receive') {
      await this.walletRepository.updateAll(
        {amountMoney: amountMoney + oldWallet?.amountMoney},
        {idOfUser},
      );
    }else if (type == 'send') {
      if (oldWallet?.amountMoney < amountMoney) {
        return this.response.status(400).send({message: 'Not enough money'});
      } else {
        await this.walletRepository.updateAll(
          {amountMoney: oldWallet?.amountMoney - amountMoney},
          {idOfUser},
        );
      }
    }

    return this.walletRepository.findOne({where: {idOfUser}});
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
