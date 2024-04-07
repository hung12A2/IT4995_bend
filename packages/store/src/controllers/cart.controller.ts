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
} from '@loopback/rest';
import {Cart} from '../models';
import {CartRepository} from '../repositories';

export class CartController {
  constructor(
    @repository(CartRepository)
    public cartRepository: CartRepository,
  ) {}

  @post('/carts/user/{idOfUser}')
  @response(200, {
    description: 'Cart model instance',
    content: {'application/json': {schema: getModelSchemaRef(Cart)}},
  })
  async create(
    @param.path.string('idOfUser') idOfUser: string,
  ): Promise<any> {
    const checkCart: any = await this.cartRepository.find({where: {idOfUser}});
    if (checkCart.length > 0) {
      return {
        message: 'Cart already exists',
      };
    }

    const newCart = new Cart({
      idOfUser,
    });
    return this.cartRepository.create(newCart);
  }

  @patch('/carts/{id}')
  @response(204, {
    description: 'Cart PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Cart, {partial: true}),
        },
      },
    })
    cart: Cart,
  ): Promise<void> {
    await this.cartRepository.updateById(id, cart);
  }

  @patch('/carts/reset/{idOfUser}')
  @response(204, {
    description: 'Cart PATCH success',
  })
  async resetById(
    @param.path.string('id') idOfUser: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Cart, {partial: true}),
        },
      },
    })
    cart: Cart,
  ): Promise<any> {
    // reset cart
  }

  @del('/carts/{id}')
  @response(204, {
    description: 'Cart DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.cartRepository.deleteById(id);
  }
}
