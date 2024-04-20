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

export class WalletOfShopController {
  constructor(
    @repository(WalletOfShopRepository)
    public walletOfShopRepository: WalletOfShopRepository,
  ) {}

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
      return response.status(400).send({message: 'Wallet already exists'});
    } else {
      return this.walletOfShopRepository.create(NewWallet);
    }
  }

  @get('/wallet-of-shops/count')
  @response(200, {
    description: 'WalletOfShop model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(WalletOfShop) where?: Where<WalletOfShop>,
  ): Promise<Count> {
    return this.walletOfShopRepository.count(where);
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

  @patch('/wallet-of-shops')
  @response(200, {
    description: 'WalletOfShop PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(WalletOfShop, {partial: true}),
        },
      },
    })
    walletOfShop: WalletOfShop,
    @param.where(WalletOfShop) where?: Where<WalletOfShop>,
  ): Promise<Count> {
    return this.walletOfShopRepository.updateAll(walletOfShop, where);
  }

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

  @put('/wallet-of-shops/{id}')
  @response(204, {
    description: 'WalletOfShop PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() walletOfShop: WalletOfShop,
  ): Promise<void> {
    await this.walletOfShopRepository.replaceById(id, walletOfShop);
  }

  @del('/wallet-of-shops/{id}')
  @response(204, {
    description: 'WalletOfShop DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.walletOfShopRepository.deleteById(id);
  }
}
