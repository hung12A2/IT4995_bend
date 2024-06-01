import {repository} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  requestBody,
  response,
} from '@loopback/rest';
import {ProductsInCart} from '../models';
import {ProductRepository, ProductsInCartRepository} from '../repositories';
import {inject} from '@loopback/core';

export class CartController {
  constructor(
    @repository(ProductsInCartRepository)
    public productsInCartRepository: ProductsInCartRepository,
    @repository(ProductRepository)
    public productRepository: ProductRepository,
  ) {}

  @get('/carts/user/{idOfUser}/kiot')
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
      where: {idOfUser, isKiot: true},
    });

    const productsInCartList = await Promise.all(
      productsInCart.map(async (productInCart: any) => {
        const idProduct = productInCart.idOfProduct;
        const product: any = await this.productRepository.findById(idProduct);
        return {
          ...product,
          quantity: productInCart.quantity,
          isKiot: productInCart.isKiot,
        };
      }),
    );

    return {
      code: 200,
      data: productsInCartList,
    };
  }

  @get('/carts/user/{idOfUser}/online')
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
  async findOnline(
    @param.path.string('idOfUser') idOfUser: string,
  ): Promise<any> {
    const productsInCart = await this.productsInCartRepository.find({
      where: {idOfUser, isKiot: false},
    });

    const productsInCartList = await Promise.all(
      productsInCart.map(async (productInCart: any) => {
        const idProduct = productInCart.idOfProduct;
        const product: any = await this.productRepository.findById(idProduct);
        return {
          ...product,
          quantity: productInCart.quantity,
          isKiot: productInCart.isKiot,
        };
      }),
    );

    return {
      code: 200,
      data: productsInCartList,
    };
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
    const {quantity, isKiot} = productsInCart;
    const checkProduct = await this.productRepository.findById(idOfProduct);
    if (!checkProduct)
      return {
        code: 400,
        message: 'Product not found',
      };
    if (!checkProduct.isKiotProduct && isKiot) {
      return {
        code: 400,
        message: 'This product is not Kiot product',
      };
    }
    const oldProductInCart: any = await this.productsInCartRepository.find({
      where: {idOfProduct, idOfUser, isKiot},
    });

    if (oldProductInCart?.length > 0) {
      await this.productsInCartRepository.updateAll(
        {quantity},
        {idOfProduct, idOfUser, isKiot},
      );

      if (quantity == 0) {
        await this.productsInCartRepository.deleteAll({
          idOfProduct,
          idOfUser,
          isKiot,
        });
      }
    } else {
      await this.productsInCartRepository.create({
        quantity,
        idOfProduct,
        idOfUser,
        isKiot,
      });
    }
    return {
      message: 'Product added to cart',
    };
  }
}
