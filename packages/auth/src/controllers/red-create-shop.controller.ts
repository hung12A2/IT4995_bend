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
  RestBindings,
  Response,
} from '@loopback/rest';
import {RequestCreateShop} from '../models';
import {RequestCreateShopRepository} from '../repositories';
import {inject} from '@loopback/core';
import multer from 'multer';
import {uploadFile} from '../config/firebaseConfig';

// upload
const storage = multer.memoryStorage();
const upload = multer({storage});

var cpUpload = upload.fields([{name: 'image'}]);
// upload img 

export class RedCreateShopController {
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
    @requestBody({
      description: 'multipart/form-data value.',
      required: true,
      content: {
        'multipart/form-data': {
          // Skip body parsing
          'x-parser': 'stream',
          schema: {type: 'object'},
        },
      },
    })
    request: Request,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise<any> {
    const data: any = await new Promise<object>((resolve, reject) => {
      cpUpload(request, response, (err: unknown) => {
        if (err) reject(err);
        else {
          const files = request.files;
          resolve({
            files: files,
            body: request.body,
          });
        }
      });
    });

    const data2 = await uploadFile(data.files.image[0]);

    return data2;
    //return this.requestCreateShopRepository.create(requestCreateShop);
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

  @put('/request-create-shops/{id}')
  @response(204, {
    description: 'RequestCreateShop PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() requestCreateShop: RequestCreateShop,
  ): Promise<void> {
    await this.requestCreateShopRepository.replaceById(id, requestCreateShop);
  }

  @del('/request-create-shops/{id}')
  @response(204, {
    description: 'RequestCreateShop DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.requestCreateShopRepository.deleteById(id);
  }
}
