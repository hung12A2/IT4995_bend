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

export class NotificationShopController {
  constructor() {}

  @get('/notification-for-shops/count')
  @response(200, {
    description: 'Notification model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.query.object('filter') filter: string): Promise<any> {
    const data = notificationAxios
      .get('/notification-for-shops/count', {params: {filter}})
      .then(res => res)
      .catch(err => console.log(err));
    return data;
  }

  @get('/notification-for-shops')
  @response(200, {
    description: 'Notification model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async getAll(@param.query.object('filter') filter: string): Promise<any> {
    console.log(filter);
    const data = notificationAxios
      .get('/notification-for-shops', {params: {filter}})
      .then(res => res)
      .catch(err => console.log(err));
    return data;
  }

  @get('/notification-for-shops/{id}')
  @response(200, {
    description: 'Notification model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async getOne(@param.path.string('id') id: string): Promise<any> {
    const data = notificationAxios
      .get(`/notification-for-shops/${id}`)
      .then(res => res)
      .catch(err => console.log(err));

    return data;
  }
}
