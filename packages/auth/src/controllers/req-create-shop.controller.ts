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
  Request,
} from '@loopback/rest';
import {RequestCreateShop} from '../models';
import {bucket} from '../config/firebaseConfig';
import {RequestCreateShopRepository} from '../repositories';
import {Storage} from '@google-cloud/storage';

var multer = require('multer');

const uploader = multer({
  storage: multer.memoryStorage(),
});

var cpUpload = uploader.fields([{name: 'image'}, {name: 'video'}]);

export class ReqCreateShopController {
  constructor(
    @repository(RequestCreateShopRepository)
    public requestCreateShopRepository: RequestCreateShopRepository,
  ) {}

  @post('/request-create-shops')
  @response(200, {
    description: 'RequestCreateShop model instance',
    content: {
      'application/json': {schema: getModelSchemaRef(RequestCreateShop)},
    },
  })
  async create(
    @requestBody()
    requestCreateShop: any,
  ): Promise<any> {
    const files = requestCreateShop.file;
    console.log (files)
  }

  @get('/request-create-shops/count')
  @response(200, {
    description: 'RequestCreateShop model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(RequestCreateShop) where?: Where<RequestCreateShop>,
  ): Promise<Count> {
    return this.requestCreateShopRepository.count(where);
  }

  @get('/request-create-shops')
  @response(200, {
    description: 'Array of RequestCreateShop model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(RequestCreateShop, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(RequestCreateShop) filter?: Filter<RequestCreateShop>,
  ): Promise<RequestCreateShop[]> {
    return this.requestCreateShopRepository.find(filter);
  }

  @get('/request-create-shops/{id}')
  @response(200, {
    description: 'RequestCreateShop model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(RequestCreateShop, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(RequestCreateShop, {exclude: 'where'})
    filter?: FilterExcludingWhere<RequestCreateShop>,
  ): Promise<RequestCreateShop> {
    return this.requestCreateShopRepository.findById(id, filter);
  }

  @patch('/request-create-shops/{id}')
  @response(204, {
    description: 'RequestCreateShop PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RequestCreateShop, {partial: true}),
        },
      },
    })
    requestCreateShop: RequestCreateShop,
  ): Promise<void> {
    await this.requestCreateShopRepository.updateById(id, requestCreateShop);
  }

  @del('/request-create-shops/{id}')
  @response(204, {
    description: 'RequestCreateShop DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.requestCreateShopRepository.deleteById(id);
  }
}
