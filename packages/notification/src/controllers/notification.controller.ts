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
import {Notification} from '../models';
import {NotificationRepository} from '../repositories';

export class NotificationController {
  constructor(
    @repository(NotificationRepository)
    public notificationRepository: NotificationRepository,
  ) {}

  @post('/notifications')
  @response(200, {
    description: 'Notification model instance',
    content: {'application/json': {schema: getModelSchemaRef(Notification)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Notification, {
            title: 'NewNotification',
            exclude: ['id'],
          }),
        },
      },
    })
    notification: Omit<Notification, 'id'>,
  ): Promise<Notification> {
    return this.notificationRepository.create(notification);
  }

  @get('/notifications')
  @response(200, {
    description: 'Array of Notification model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Notification, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Notification) filter?: Filter<Notification>,
  ): Promise<any> {
    const data = await this.notificationRepository.find(filter);
    return {
      code: 200,
      data,
    };
  }

  @get('/notifications/count')
  @response(200, {
    description: 'Array of Notification model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Notification, {includeRelations: true}),
        },
      },
    },
  })
  async count(
    @param.filter(Notification) filter?: Filter<Notification>,
  ): Promise<any> {
    const data = await this.notificationRepository.count(filter);
    return {
      code: 200,
      data,
    };
  }

  @get('/notifications/{id}')
  @response(200, {
    description: 'Array of Notification model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Notification, {includeRelations: true}),
        },
      },
    },
  })
  async getOne(@param.path.string('id') id: string): Promise<any> {
    const data = await this.notificationRepository.findById(id);
    return {
      code: 200,
      data,
    };
  }
}
