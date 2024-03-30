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
import {Store} from '../models';
import {StoreRepository} from '../repositories';

export class StoreController {
  constructor(
    @repository(StoreRepository)
    public storeRepository: StoreRepository,
  ) {}

  // for admin + user 
  @get('/stores')
  @response(200, {
    description: 'Array of Store model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Store, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(Store) filter?: Filter<Store>): Promise<Store[]> {
    return await this.storeRepository.find(filter);
  }

  // for admin + store owner
  // tim day du thong tin shop cua minh
  // tim thong tin shop nguoi khac bang filter
  @get('/stores/{id}')
  @response(200, {
    description: 'Store model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Store, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Store, {exclude: 'where'})
    filter?: FilterExcludingWhere<Store>,
  ): Promise<Store> {
    return this.storeRepository.findById(id, filter);
  }

  // for store owner update store info
  // for admin update permission of store
  @patch('/stores/{id}')
  @response(204, {
    description: 'Store PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Store, {partial: true}),
        },
      },
    })
    store: Store,
  ): Promise<void> {
    await this.storeRepository.updateById(id, store);
  }

  

  // for store owner
  @patch('/stores/stopWorking/{id}')
  @response(204, {
    description: 'Store stopWorking success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.storeRepository.updateById(id, {status: 'stopWorking'});
  }

  // for admin
  @patch('/stores/banned/{id}')
  @response(204, {
    description: 'Store Banned success',
  })
  async BanedById(@param.path.string('id') id: string): Promise<void> {
    await this.storeRepository.updateById(id, {status: 'banned'});
  }
}
