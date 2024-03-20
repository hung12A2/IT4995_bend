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
import {RequestCreateShop} from '../models';
import {RequestCreateShopRepository} from '../repositories';

export class RedCreateShopController {
  constructor(
    @repository(RequestCreateShopRepository)
    public requestCreateShopRepository : RequestCreateShopRepository,
  ) {}

  @post('/request-create-shops')
  @response(200, {
    description: 'RequestCreateShop model instance',
    content: {'application/json': {schema: getModelSchemaRef(RequestCreateShop)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RequestCreateShop, {
            title: 'NewRequestCreateShop',
            exclude: ['id'],
          }),
        },
      },
    })
    requestCreateShop: Omit<RequestCreateShop, 'id'>,
  ): Promise<RequestCreateShop> {
    return this.requestCreateShopRepository.create(requestCreateShop);
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
    @param.filter(RequestCreateShop, {exclude: 'where'}) filter?: FilterExcludingWhere<RequestCreateShop>
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
