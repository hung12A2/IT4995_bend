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

function normalizeString(str: string): string {
  const accentsMap: any = {
    á: 'a',
    à: 'a',
    ả: 'a',
    ã: 'a',
    ạ: 'a',
    ă: 'a',
    ắ: 'a',
    ằ: 'a',
    ẳ: 'a',
    ẵ: 'a',
    ặ: 'a',
    â: 'a',
    ấ: 'a',
    ầ: 'a',
    ẩ: 'a',
    ẫ: 'a',
    ậ: 'a',
    é: 'e',
    è: 'e',
    ẻ: 'e',
    ẽ: 'e',
    ẹ: 'e',
    ê: 'e',
    ế: 'e',
    ề: 'e',
    ể: 'e',
    ễ: 'e',
    ệ: 'e',
    í: 'i',
    ì: 'i',
    ỉ: 'i',
    ĩ: 'i',
    ị: 'i',
    ó: 'o',
    ò: 'o',
    ỏ: 'o',
    õ: 'o',
    ọ: 'o',
    ô: 'o',
    ố: 'o',
    ồ: 'o',
    ổ: 'o',
    ỗ: 'o',
    ộ: 'o',
    ơ: 'o',
    ớ: 'o',
    ờ: 'o',
    ở: 'o',
    ỡ: 'o',
    ợ: 'o',
    ú: 'u',
    ù: 'u',
    ủ: 'u',
    ũ: 'u',
    ụ: 'u',
    ư: 'u',
    ứ: 'u',
    ừ: 'u',
    ử: 'u',
    ữ: 'u',
    ự: 'u',
    ý: 'y',
    ỳ: 'y',
    ỷ: 'y',
    ỹ: 'y',
    ỵ: 'y',
    đ: 'd',
  };

  return str
    .split('')
    .map(char => accentsMap[char] || char)
    .join('')
    .replace(/\s+/g, '');
}

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
    const searchExist = await this.searchRepository.findOne({
      where: {keyWord: search.keyWord, idOfUser: userId},
    });

    if (searchExist) {
      await this.searchRepository.updateAll(
        {updatedAt: new Date().toLocaleString()},
        {
          keyWord: search.keyWord,
          idOfUser: userId,
        },
      );
    } else {
      await this.searchRepository.create({
        keyWord: search.keyWord,
        idOfUser: userId,
        createdAt: new Date().toLocaleString(),
        updatedAt: new Date().toLocaleString(),
      });
    }

    return {
      code: 200,
      message: 'Create search success',
    };
  }

  @get('/searches/count')
  @response(200, {
    description: 'Search model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Search) where?: Where<Search>): Promise<Count> {
    return this.searchRepository.count(where);
  }

  @get('/searches')
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
  async findByUser(
    @param.query.object('filter') filter?: Filter<Search>,
  ): Promise<any> {
    return this.searchRepository.find(filter);
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
    @param.query.object('filter') filter?: any,
  ): Promise<any> {
    let productsReturn = [];

    let products = await this.productRepository.find(filter);

    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      let name = normalizeString(product.name.trim().toLowerCase());
      let keyWordNormalize = normalizeString(keyWord.trim().toLowerCase());
      let productDescription = normalizeString(
        product.productDescription.trim().toLowerCase(),
      );
      let productDetails = normalizeString(
        product.productDetails.trim().toLowerCase(),
      );

      if (
        name.includes(keyWordNormalize) ||
        productDescription.includes(keyWordNormalize) ||
        productDetails.includes(keyWordNormalize)
      ) {
        productsReturn.push(product);
      }
    }

    return productsReturn;
  }

  @post('/suggestForUser')
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
  async suggest(
    @requestBody({
      description: 'Search model instance',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              listKeyWord: {
                type: 'array',
                items: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    })
    req: any,
  ): Promise<any> {
    let listKeyWord = req.listKeyWord;
    let productsReturn = [];

    let products = await this.productRepository.find();
    let keyWordNormalize = [];
    for (let i = 0; i < listKeyWord.length; i++) {
      keyWordNormalize.push(
        normalizeString(listKeyWord[i].trim().toLowerCase()),
      );
    }
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      let name = normalizeString(product.name.trim().toLowerCase());
      let productDescription = normalizeString(
        product.productDescription.trim().toLowerCase(),
      );
      let productDetails = normalizeString(
        product.productDetails.trim().toLowerCase(),
      );

      for (let j = 0; j < keyWordNormalize.length; j++) {
        if (
          name.includes(keyWordNormalize[j]) ||
          productDescription.includes(keyWordNormalize[j]) ||
          productDetails.includes(keyWordNormalize[j])
        ) {
          productsReturn.push(product);
          break;
        }
      }
    }

    return productsReturn;
  }

  @del('/searches/{id}')
  @response(204, {
    description: 'Search DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.searchRepository.deleteById(id);
  }
}
