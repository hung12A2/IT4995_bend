// Uncomment these imports to begin using these cool features!

// import {inject} from '@loopback/core';

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
import {authenticate} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {basicAuthorization} from '../services/basicAuthorize';
import {inject} from '@loopback/core';
import {SecurityBindings, UserProfile} from '@loopback/security';

export class transactionShopsController {
  constructor() {}

  @get('/transaction-shops/count')
  @response(200, {
    description: 'Transaction model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.query.object('filter') filter: string): Promise<any> {
    const data = notificationAxios
      .get('/transaction-shops/count', {params: {filter}})
      .then(res => res)
      .catch(err => console.log(err));
    return data;
  }

  @get('/transaction-shops')
  @response(200, {
    description: 'Transaction model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async getAll(@param.query.object('filter') filter: string): Promise<any> {
    console.log(filter);
    const data = notificationAxios
      .get('/transaction-shops', {params: {filter}})
      .then(res => res)
      .catch(err => console.log(err));
    return data;
  }

  @authenticate('jwt')
  @authorize({voters: [basicAuthorization], allowedRoles: ['employee']})
  @get('/transaction-shopsForShop')
  @response(200, {
    description: 'Transaction model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async getAllForShop(
    @inject(SecurityBindings.USER) currentUser: UserProfile,
    @param.query.object('filter') filter: any,
  ): Promise<any> {
    const idOfShop = currentUser.idOfShop;
    let where: any;
    if (filter) {
      where = filter?.where || {};
      where = {...where, idOfShop};
      filter.where = where;
    }
    const data = notificationAxios
      .get('/transaction-shops', {params: {filter}})
      .then(res => res)
      .catch(err => console.log(err));
    return data;
  }


  @authenticate('jwt')
  @authorize({voters: [basicAuthorization], allowedRoles: ['employee']})
  @get('/transaction-shopsForShop/days/{days}')
  @response(200, {
    description: 'Transaction model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async getDaysForShop(
    @inject(SecurityBindings.USER) currentUser: UserProfile,
    @param.path.number('days') days: number,
  ): Promise<any> {
    const idOfShop = currentUser.idOfShop;
    const data = notificationAxios
      .get(`/transaction-shops/days/${days}/shop/${idOfShop}`)
      .then(res => res)
      .catch(err => console.log(err));
    return data;
  }

  @authenticate('jwt')
  @authorize({voters: [basicAuthorization], allowedRoles: ['employee']})
  @get('/transaction-shopsForShop/sum/{days}')
  @response(200, {
    description: 'Transaction model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async getSumForShop(
    @inject(SecurityBindings.USER) currentUser: UserProfile,
    @param.path.number('days') days: number,
  ): Promise<any> {
    const idOfShop = currentUser.idOfShop;
    const data = notificationAxios
      .get(`/transaction-shops/sum/${days}/shop/${idOfShop}`)
      .then(res => res)
      .catch(err => console.log(err));
    return data;
  }

  @authenticate('jwt')
  @authorize({voters: [basicAuthorization], allowedRoles: ['employee']})
  @get('/transaction-shopsForShop/count')
  @response(200, {
    description: 'Transaction model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async countAllForShop(
    @inject(SecurityBindings.USER) currentUser: UserProfile,
    @param.query.object('filter') filter: any,
  ): Promise<any> {
    const idOfShop = currentUser.idOfShop;
    let where: any;
    if (filter) {
      where = filter?.where || {};
      where = {...where, idOfShop};
      filter.where = where;
    }
    const data = notificationAxios
      .get('/transaction-shops/count', {params: {filter}})
      .then(res => res)
      .catch(err => console.log(err));
    return data;
  }

  @authenticate('jwt')
  @authorize({voters: [basicAuthorization], allowedRoles: ['employee']})
  @get('/transaction-shopsForShop/{id}')
  @response(200, {
    description: 'Transaction model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async getOneForShop(@param.path.string('id') id: string): Promise<any> {
    const data = notificationAxios
      .get(`/transaction-shops/${id}`)
      .then(res => res)
      .catch(err => console.log(err));
    return data;
  }

  @get('/transaction-shops/{id}')
  @response(200, {
    description: 'Transaction model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async getOne(@param.path.string('id') id: string): Promise<any> {
    const data = notificationAxios
      .get(`/transaction-shops/${id}`)
      .then(res => res)
      .catch(err => console.log(err));

    return data;
  }
}
