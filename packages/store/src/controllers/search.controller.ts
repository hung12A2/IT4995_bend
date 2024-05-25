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
import {Search} from '../models';
import {ProductRepository, SearchRepository} from '../repositories';

export class SearchController {
  constructor(
    @repository(SearchRepository)
    public searchRepository: SearchRepository,
    @repository(ProductRepository)
    public productRepository: ProductRepository,
  ) {}

  @post('/searches/user/{userId}')
  @response(200, {
    description: 'Search model instance',
    content: {'application/json': {schema: getModelSchemaRef(Search)}},
  })
  async create(
    @param.path.string('userId') userId: string,
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              keyWord: {type: 'string'},
            },
          },
        },
      },
    })
    search: any,
  ): Promise<any> {
    await this.searchRepository.create({
      keyWord: search.keyWord,
      idOfUser: userId,
      createdAt: new Date().toLocaleString(),
    });

    const regex = new RegExp(search.keyWord.replace(/\s+/g, ''), 'i');

    const products = await this.productRepository.find({
      where: {
        or: [
          {name: {like: regex}},
          {productDescription: {like: regex}},
          {productDetails: {like: regex}},
        ],
      },
    });

    return products;
  }

  @get('/searches/count')
  @response(200, {
    description: 'Search model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Search) where?: Where<Search>): Promise<Count> {
    return this.searchRepository.count(where);
  }

  @get('/searches/{userId}')
  @response(200, {
    description: 'Array of Search model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Search, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.path.string('userId') userId: string): Promise<any> {
    return this.searchRepository.findOne({where: {idOfUser: userId}});
  }

  @get('/searches/key/{keyWord}')
  @response(200, {
    description: 'Array of Search model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Search, {includeRelations: true}),
        },
      },
    },
  })
  async findProductByKey(
    @param.path.string('keyWord') keyWord: string,
  ): Promise<any> {
    const regex = new RegExp(keyWord.replace(/\s+/g, ''), 'i');

    const products = await this.productRepository.find({
      where: {
        or: [
          {name: {like: regex}},
          {productDescription: {like: regex}},
          {productDetails: {like: regex}},
        ],
      },
    });

    return products;
  }

  @del('/searches/{id}')
  @response(204, {
    description: 'Search DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.searchRepository.deleteById(id);
  }
}
