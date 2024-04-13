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
  ProductRepository,
  RatingProductRepository,
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
  ) {
  }

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
            },
          },
        },
      },
    })
    ratingProduct: any,
  ): Promise<any> {

    const {rating, comment} = ratingProduct;
    const BoughtProduct: any = await this.boughtProductRepository.findOne({
      where: {idOfOrder: idOfOrder, idOfProduct: idOfProduct},
    });
    if (!BoughtProduct) {
      this.response.status(400).send('Product not found');
    }
    const idOfUser = BoughtProduct.idOfUser;

    const oldRating: any = await this.ratingProductRepository.findOne({
      where: {idOfOrder, idOfProduct, idOfUser},
    });
    if (oldRating) {
      const totalRating: any = await this.ratingProductRepository.count({
        idOfProduct,
      });
      const oldProduct = (await this.productRepository.findById(idOfProduct))
        .rating;
      const newRating = (oldProduct * (totalRating.count) + rating - oldRating.rating ) / totalRating.count;

      await this.ratingProductRepository.updateById(oldRating.id, {rating, comment})
      await this.productRepository.updateById(idOfProduct, {rating: newRating});
    }
    const isDeleted = false;
    const newRatingProduct = {
      idOfOrder,
      idOfProduct,
      idOfUser,
      rating,
      isDeleted,
      comment,
    };

    const data = await this.ratingProductRepository.create(newRatingProduct);

    if (data.id) {
      const totalRating: any = await this.ratingProductRepository.count({
        idOfProduct,
      });
      const oldProduct = (await this.productRepository.findById(idOfProduct))
        .rating;
      const newRating = (oldProduct * (totalRating.count - 1) + rating) / totalRating.count;

      await this.productRepository.updateById(idOfProduct, {rating: newRating});
    } else {
      return this.response.status(400).send('Rating failed');
    }

    return this.ratingProductRepository.findOne({where: {idOfOrder, idOfProduct, idOfUser}});
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

  @del('/rating-products/{id}')
  @response(204, {
    description: 'RatingProduct DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.ratingProductRepository.deleteById(id);
  }
}
