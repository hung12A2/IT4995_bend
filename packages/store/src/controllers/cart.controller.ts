import {
  repository,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  requestBody,
  response,

} from '@loopback/rest';
import {ProductsInCart} from '../models';
import {
  ProductRepository,
  ProductsInCartRepository,
} from '../repositories';
import {inject} from '@loopback/core';

export class CartController {
  constructor(
    @repository(ProductsInCartRepository)
    public productsInCartRepository: ProductsInCart,
    @repository(ProductRepository)
    public productRepository: ProductRepository,
  ) {}

  @get('/carts/user/{idOfUser}')
  @response(200, {
    description: 'Array of Cart model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(ProductsInCart, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.path.string('idOfUser') idOfUser: string): Promise<any> {
    const productsInCart = await this.productsInCartRepository.find({
      where: {idOfUser},
    });

    const productsInCartList = await Promise.all(
      productsInCart.map(async (productInCart: any) => {
        const idProduct = productInCart.idOfProduct;
        const product: any = await this.productRepository.findById(idProduct);
        const {name, price, image} = product;
        return {
          name,
          price,
          image,
          quantity: productInCart.quantity,
        };
      }),
    );

    return productsInCartList;
  }

  @post('/carts/user/{idOfUser}/product/{idOfProduct}')
  @response(200, {
    description: 'Cart model instance',
    content: {'application/json': {schema: getModelSchemaRef(ProductsInCart)}},
  })
  async addProductToCart(
    @param.path.string('idOfUser') idOfUser: string,
    @param.path.string('idOfProduct') idOfProduct: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProductsInCart, {partial: true}),
        },
      },
    })
    productsInCart: ProductsInCart,
  ): Promise<any> {
    const {quantity} = productsInCart;
    const oldProductInCart: any = this.productsInCartRepository.find({
      idOfProduct,
      idOfUser,
    });
    if (oldProductInCart.length > 0) {
      await this.productsInCartRepository.updateById(
        {idOfProduct, idOfUser},
        {quantity},
      );
    } else {
      await this.productsInCartRepository.create({
        quantity,
        idOfProduct,
        idOfUser,
      });
    }
    return {
      message: 'Product added to cart',
    };
  }
}
