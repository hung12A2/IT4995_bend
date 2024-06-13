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

import notificationAxios from '../services/notificationAxios.service';

export class NotificationController {
  constructor() {}

  @get('/notifications/count')
  @response(200, {
    description: 'Notification model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.query.object('filter') filter: string): Promise<any> {
    const data = await notificationAxios
      .get('/notifications/count', {params: {filter}})
      .then(res => res)
      .catch(err => console.log(err));
    return data;
  }

  @get('/notifications')
  @response(200, {
    description: 'Notification model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async getAll(@param.query.object('filter') filter: string): Promise<any> {
    const data = await notificationAxios
      .get('/notifications', {params: {filter}})
      .then(res => res)
      .catch(err => console.log(err));
    return data;
  }

  @get('/notifications/{id}')
  @response(200, {
    description: 'Notification model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async getOne(@param.path.string('id') id: string): Promise<any> {
    const data = await notificationAxios
      .get(`/notifications/${id}`)
      .then(res => res)
      .catch(err => console.log(err));

    return data;
  }
}
