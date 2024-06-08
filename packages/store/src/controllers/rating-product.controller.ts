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
import {RatingProduct} from '../models';
import {
  BoughtProductRepository,
  KiotInfoRepository,
  OrderKiotRepository,
  OrderRepository,
  ProductRepository,
  RatingProductRepository,
  ShopInfoRepository,
} from '../repositories';
import {inject} from '@loopback/core';

export class RatingProductController {
  constructor(
    @repository(ProductRepository)
    public productRepository: ProductRepository,
    @repository(RatingProductRepository)
    public ratingProductRepository: RatingProductRepository,
    @repository(BoughtProductRepository)
    public boughtProductRepository: BoughtProductRepository,
    @inject(RestBindings.Http.RESPONSE) public response: Response,
    @repository(ShopInfoRepository)
    public shopInfoRepository: ShopInfoRepository,
    @repository(KiotInfoRepository)
    public kiotInfoRepository: KiotInfoRepository,
    @repository(OrderKiotRepository)
    public orderKiotRepository: OrderKiotRepository,
    @repository(OrderRepository)
    public orderRepository: OrderRepository,
  ) {}

  @post('/rating-products/order/{idOfOrder}/product/{idOfProduct}')
  @response(200, {
    description: 'RatingProduct model instance',
    content: {'application/json': {schema: getModelSchemaRef(RatingProduct)}},
  })
  async create(
    @param.path.string('idOfOrder') idOfOrder: string,
    @param.path.string('idOfProduct') idOfProduct: string,
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              rating: {type: 'number'},
              comment: {type: 'string'},
              isKiot: {type: 'boolean'},
              idOfKiot: {type: 'string'},
              idOfShop: {type: 'string'},
            },
          },
        },
      },
    })
    ratingProduct: any,
  ): Promise<any> {
    const {rating, comment, isKiot = false, idOfShop} = ratingProduct;
    let idOfKiot = ratingProduct.idOfKiot;

    if (isKiot && !idOfKiot) {
      return {
        code: 400,
        message: 'idOfKiot is required',
      };
    }

    if (!isKiot) {
      const oldOrder: any = await this.orderRepository.findById(idOfOrder);
      await this.orderRepository.updateById(idOfOrder, {
        status: 'rating',
        logs: [
          ...oldOrder.logs,
          {
            status: 'rating',
            updatedAt: new Date().toLocaleString(),
          },
        ],
        updatedAt: new Date().toLocaleString(),
      });

      const BoughtProduct: any = await this.boughtProductRepository.findOne({
        where: {idOfOrder: idOfOrder, idOfProduct: idOfProduct, isKiot},
      });
      if (!BoughtProduct) {
        return {
          code: 400,
          message: 'You can not rate this product',
        };
      }
      const idOfUser = BoughtProduct.idOfUser;

      const oldRating: any = await this.ratingProductRepository.findOne({
        where: {idOfOrder, idOfProduct, idOfUser},
      });
      if (oldRating) {
        const totalRating: any = await this.ratingProductRepository.count({
          idOfProduct,
        });
        const oldProduct: any = (
          await this.productRepository.findById(idOfProduct)
        ).rating;

        const oldShopInfo: any = await this.shopInfoRepository.findOne({
          where: {idOfShop: oldProduct.idOfShop},
        });
        const newRating =
          (oldProduct * totalRating.count + rating - oldRating.rating) /
          totalRating.count;

        const newAvgRating =
          (oldShopInfo.avgRating * oldShopInfo.numberOfRating +
            rating -
            oldRating.rating) /
          oldShopInfo.numberOfRating;

        await this.shopInfoRepository.updateById(oldShopInfo.id, {
          avgRating: newAvgRating,
        });

        await this.ratingProductRepository.updateById(oldRating.id, {
          updatedAt: new Date().toLocaleString(),
          rating,
          comment,
        });
        await this.productRepository.updateById(idOfProduct, {
          rating: newRating,
        });

        return {
          code: 200,
          message: 'Rating updated',
        };
      } else {
        const isDeleted = false;
        const time = new Date().toLocaleString();
        const newRatingProduct = {
          idOfOrder,
          idOfProduct,
          idOfUser,
          rating,
          idOfShop,
          isDeleted,
          comment,
          createdAt: time,
          updatedAt: time,
        };

        const data =
          await this.ratingProductRepository.create(newRatingProduct);

        if (data.id) {
          const totalRating: any = await this.ratingProductRepository.count({
            idOfProduct,
          });
          const oldProduct: any =
            await this.productRepository.findById(idOfProduct);

          const oldShopInfo: any = await this.shopInfoRepository.findOne({
            where: {idOfShop: oldProduct.idOfShop},
          });

          await this.shopInfoRepository.updateById(oldShopInfo.id, {
            numberOfRating: oldShopInfo.numberOfRating + 1,
            avgRating:
              (oldShopInfo.avgRating * oldShopInfo.numberOfRating + rating) /
              (oldShopInfo.numberOfRating + 1),
          });

          const newRating =
            (oldProduct.rating * (totalRating.count - 1) + rating) /
            totalRating.count;

          await this.productRepository.updateById(idOfProduct, {
            rating: newRating,
            numberOfRating: oldProduct.numberOfRating + 1,
          });
        } else {
          return {
            code: 400,
            message: 'Rating failed',
          };
        }

        return this.ratingProductRepository.findOne({
          where: {idOfOrder, idOfProduct, idOfUser},
        });
      }
    } else {
      const oldOrder: any = await this.orderKiotRepository.findById(idOfOrder);
      await this.orderKiotRepository.updateById(idOfOrder, {
        status: 'rating',
        logs: [
          ...oldOrder.logs,
          {
            status: 'rating',
            updatedAt: new Date().toLocaleString(),
          },
        ],
        updatedAt: new Date().toLocaleString(),
      });
      const BoughtProduct: any = await this.boughtProductRepository.findOne({
        where: {
          idOfOrder: idOfOrder,
          idOfProduct: idOfProduct,
          isKiot,
        },
      });
      if (!BoughtProduct) {
        return {
          code: 400,
          message: 'You can not rate this product',
        };
      }
      const idOfUser = BoughtProduct.idOfUser;

      const oldRating: any = await this.ratingProductRepository.findOne({
        where: {idOfOrder, idOfProduct, idOfUser, isKiot, idOfKiot},
      });
      if (oldRating) {
        const totalRating: any = await this.ratingProductRepository.count({
          idOfProduct,
        });
        const oldProduct: any = (
          await this.productRepository.findById(idOfProduct)
        ).rating;

        const oldShopInfo: any = await this.shopInfoRepository.findOne({
          where: {idOfShop: oldProduct.idOfShop},
        });

        const oldKiotInfo: any = await this.kiotInfoRepository.findOne({
          where: {idOfShop: oldProduct.idOfShop},
        });

        const newRating =
          (oldProduct * totalRating.count + rating - oldRating.rating) /
          totalRating.count;

        const newAvgRating =
          (oldShopInfo.avgRating * oldShopInfo.numberOfRating +
            rating -
            oldRating.rating) /
          oldShopInfo.numberOfRating;

        const newAvgRatingKiot =
          (oldKiotInfo.avgRating * oldKiotInfo.numberOfRating +
            rating -
            oldRating.rating) /
          oldKiotInfo.numberOfRating;

        await this.shopInfoRepository.updateById(oldShopInfo.id, {
          avgRating: newAvgRating,
        });

        await this.kiotInfoRepository.updateById(oldKiotInfo.id, {
          avgRating: newAvgRatingKiot,
        });

        await this.ratingProductRepository.updateById(oldRating.id, {
          updatedAt: new Date().toLocaleString(),
          rating,
          comment,
        });
        await this.productRepository.updateById(idOfProduct, {
          rating: newRating,
        });

        return {
          code: 200,
          message: 'Rating updated',
        };
      } else {
        const isDeleted = false;
        const time = new Date().toLocaleString();
        const newRatingProduct = {
          idOfOrder,
          idOfProduct,
          idOfUser,
          idOfKiot,
          isKiot,
          rating,
          idOfShop,
          isDeleted,
          comment,
          createdAt: time,
          updatedAt: time,
        };

        const data =
          await this.ratingProductRepository.create(newRatingProduct);

        if (data.id) {
          const totalRating: any = await this.ratingProductRepository.count({
            idOfProduct,
          });
          const oldProduct: any =
            await this.productRepository.findById(idOfProduct);

          const oldShopInfo: any = await this.shopInfoRepository.findOne({
            where: {idOfShop: oldProduct.idOfShop},
          });

          const oldKiotInfo: any = await this.kiotInfoRepository.findOne({
            where: {idOfShop: oldProduct.idOfShop},
          });
          await this.kiotInfoRepository.updateById(oldKiotInfo.id, {
            numberOfRating: oldKiotInfo.numberOfRating + 1,
            avgRating:
              (oldKiotInfo.avgRating * oldKiotInfo.numberOfRating + rating) /
              (oldKiotInfo.numberOfRating + 1),
          });

          await this.shopInfoRepository.updateById(oldShopInfo.id, {
            numberOfRating: oldShopInfo.numberOfRating + 1,
            avgRating:
              (oldShopInfo.avgRating * oldShopInfo.numberOfRating + rating) /
              (oldShopInfo.numberOfRating + 1),
          });

          const newRating =
            (oldProduct.rating * (totalRating.count - 1) + rating) /
            totalRating.count;

          await this.productRepository.updateById(idOfProduct, {
            rating: newRating,
            numberOfRating: oldProduct.numberOfRating + 1,
          });
        } else {
          return {
            code: 400,
            message: 'Rating failed',
          };
        }

        return this.ratingProductRepository.findOne({
          where: {idOfOrder, idOfProduct, idOfUser},
        });
      }
    }
  }

  @get('/rating-products')
  @response(200, {
    description: 'Array of RatingProduct model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(RatingProduct, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(RatingProduct) filter?: Filter<RatingProduct>,
  ): Promise<RatingProduct[]> {
    return this.ratingProductRepository.find(filter);
  }

  @get('/rating-products/count')
  @response(200, {
    description: 'Array of RatingProduct model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(RatingProduct, {includeRelations: true}),
        },
      },
    },
  })
  async count(
    @param.filter(RatingProduct) filter?: Filter<RatingProduct>,
  ): Promise<any> {
    return this.ratingProductRepository.count(filter);
  }

  @get('/rating-products/{id}')
  @response(200, {
    description: 'Array of RatingProduct model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(RatingProduct, {includeRelations: true}),
        },
      },
    },
  })
  async getOne(@param.path.string('id') id: string): Promise<any> {
    return this.ratingProductRepository.findById(id);
  }

  @del('/rating-products/{id}')
  @response(204, {
    description: 'RatingProduct DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.ratingProductRepository.deleteById(id);
  }
}
