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
import {WalletOfShop} from '../models';
import {WalletOfShopRepository} from '../repositories';
import {inject} from '@loopback/core';
import {RabbitMQService} from '../services/rabbitMqServices';

export class WalletOfShopController {
  constructor(
    @repository(WalletOfShopRepository)
    public walletOfShopRepository: WalletOfShopRepository,
  ) {}

  newRabbitMQService = RabbitMQService.getInstance();

  @post('/wallet-of-shops/{idOfShop}')
  @response(200, {
    description: 'WalletOfShop model instance',
    content: {'application/json': {schema: getModelSchemaRef(WalletOfShop)}},
  })
  async create(
    @inject(RestBindings.Http.RESPONSE) response: Response,
    @param.path.string('idOfShop') idOfShop: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(WalletOfShop, {
            title: 'NewWalletOfShop',
            exclude: ['id'],
          }),
        },
      },
    })
    walletOfShop: any,
  ): Promise<any> {
    const NewWallet = {
      idOfShop,
    };

    const oldWallet = await this.walletOfShopRepository.findOne({
      where: {idOfShop},
    });
    if (oldWallet) {
      return {
        code: 400,
        message: 'Wallet of shop existed',
      };
    } else {
      const data = await this.walletOfShopRepository.create(NewWallet);
      return {
        code: 200,
        data,
      };
    }
  }

  @get('/wallet-of-shops')
  @response(200, {
    description: 'Array of WalletOfShop model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(WalletOfShop, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(WalletOfShop) filter?: Filter<WalletOfShop>,
  ): Promise<WalletOfShop[]> {
    return this.walletOfShopRepository.find(filter);
  }

  @patch('/wallet-of-shops/{idOfShop}/type/{type}')
  @response(200, {
    description: 'Wallet model instance',
    content: {'application/json': {schema: getModelSchemaRef(WalletOfShop)}},
  })
  async transferMoney(
    @param.path.string('idOfShop') idOfShop: string,
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
    const oldWallet: any = await this.walletOfShopRepository.findOne({
      where: {idOfShop},
    });
    if (type == 'receive') {
      await this.walletOfShopRepository.updateAll(
        {amountMoney: amountMoney + oldWallet?.amountMoney},
        {idOfShop},
      );
    } else if (type == 'send') {
      if (oldWallet?.amountMoney < amountMoney) {
        return {
          code: 400,
          message: 'Not enough money',
        };
      } else {
        await this.walletOfShopRepository.updateAll(
          {amountMoney: oldWallet?.amountMoney - amountMoney},
          {idOfShop},
        );
      }
    }

    const data = await this.walletOfShopRepository.findOne({where: {idOfShop}});
    return {code: 400, data};
  }

  //

  @get('/wallet-of-shops/{id}')
  @response(200, {
    description: 'WalletOfShop model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(WalletOfShop, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(WalletOfShop, {exclude: 'where'})
    filter?: FilterExcludingWhere<WalletOfShop>,
  ): Promise<WalletOfShop> {
    return this.walletOfShopRepository.findById(id, filter);
  }

  @patch('/wallet-of-shops/{id}')
  @response(204, {
    description: 'WalletOfShop PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(WalletOfShop, {partial: true}),
        },
      },
    })
    walletOfShop: WalletOfShop,
  ): Promise<void> {
    await this.walletOfShopRepository.updateById(id, walletOfShop);
  }

  @del('/wallet-of-shops/{id}')
  @response(204, {
    description: 'WalletOfShop DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.walletOfShopRepository.deleteById(id);
  }
}
