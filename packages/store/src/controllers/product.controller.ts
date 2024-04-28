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
  Request,
} from '@loopback/rest';
import {Product} from '../models';
import {CategoryRepository, ProductRepository} from '../repositories';

import {uploadFile, deleteRemoteFile} from '../config/firebaseConfig';
import multer from 'multer';
import {inject} from '@loopback/core';

const storage = multer.memoryStorage();
const upload = multer({storage});

var cpUpload = upload.fields([{name: 'image'}]);

export class ProductController {
  constructor(
    @repository(ProductRepository)
    public productRepository: ProductRepository,
    @repository(CategoryRepository)
    public categoryRepository: CategoryRepository,
  ) {}

  @get('/products')
  @response(200, {
    description: 'Array of Product model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Product, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(Product) filter?: Filter<Product>): Promise<any> {
    const data = await this.productRepository.find(filter);
    return {
      code: 200,
      data,
    };
  }

  @get('/products/{id}')
  @response(200, {
    description: 'Product model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Product, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Product, {exclude: 'where'})
    filter?: FilterExcludingWhere<Product>,
  ): Promise<Product> {
    return this.productRepository.findById(id, filter);
  }

  @patch('/products/shop/{idOfShop}/category/{idOfCategory}/{id}')
  @response(204, {
    description: 'Product PATCH success',
  })
  async updateById(
    @param.path.string('idOfShop') idOfShop: string,
    @param.path.string('idOfCategory') idOfCategory: string,
    @param.path.string('id') id: string,
    @requestBody({
      description: 'multipart/form-data value.',
      required: true,
      content: {
        'application/json': {
          // Skip body parsing
          schema: {type: 'object'},
        },
      },
    })
    request: any,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise<any> {
    const {
      price,
      countInStock,
      isBestSeller,
      weight,
      dimension,
      status,
      isKiotProduct,
      isOnlineProduct,
      idOfKiot,
    } = request;

    if (isKiotProduct && !idOfKiot) {
      return {
        code: 400,
        message: 'idOfKiot is required',
      };
    }

    const category = await this.categoryRepository.findById(idOfCategory);

    if (!category) {
      return {
        code: 400,
        message: 'Category not found',
      };
    }

    const cateName = category.cateName;

    const time = new Date().toLocaleString();
    const product = new Product({
      idOfCategory,
      idOfShop,
      isKiotProduct,
      isOnlineProduct,
      price,
      countInStock,
      isBestSeller,
      cateName,
      status,
      weight,
      dimension,
      updatedAt: time,
      updatedBy: `shop-${idOfShop}`,
    });

    await this.productRepository.updateById(id, product);

    return this.productRepository.findById(id);
  }

  @del('/products/{id}')
  @response(204, {
    description: 'Product DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.productRepository.deleteById(id);
  }
}
