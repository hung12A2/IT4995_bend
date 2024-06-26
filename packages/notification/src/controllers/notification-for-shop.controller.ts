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
import {NotificationForShop} from '../models';
import {NotificationForShopRepository} from '../repositories';

export class NotificationForShopController {
  constructor(
    @repository(NotificationForShopRepository)
    public notificationForShopRepository : NotificationForShopRepository,
  ) {}

  @get('/notification-for-shops')
  @response(200, {
    description: 'Array of NotificationForShop model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(NotificationForShop, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(NotificationForShop) filter?: Filter<NotificationForShop>,
  ): Promise<any> {
    const data = await this.notificationForShopRepository.find(filter);
    return {
      code: 200,
      data
    }
  }

  @get('/notification-for-shops/count')
  @response(200, {
    description: 'Array of NotificationForShop model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(NotificationForShop, {includeRelations: true}),
        },
      },
    },
  })
  async count(
    @param.filter(NotificationForShop) filter?: Filter<NotificationForShop>,
  ): Promise<any> {
    const data = await this.notificationForShopRepository.count(filter);
    return {
      code: 200,
      data
    }
  }

  @get('/notification-for-shops/{id}')
  @response(200, {
    description: 'Array of NotificationForShop model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(NotificationForShop, {includeRelations: true}),
        },
      },
    },
  })
  async getOne(
    @param.path.string('id') id: string,
  ): Promise<any> {
    const data = await this.notificationForShopRepository.findById(id)
    return {
      code: 200,
      data
    }
  }


  @del('/notification-for-shops/{id}')
  @response(204, {
    description: 'NotificationForShop DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.notificationForShopRepository.deleteById(id);
  }
}
