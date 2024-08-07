// Uncomment these imports to begin using these cool features!

// import {inject} from '@loopback/core';
// ReqCreateShopController

import {inject} from '@loopback/core';
import {
  post,
  requestBody,
  get,
  RestBindings,
  Response,
  Request,
  response,
  param,
} from '@loopback/rest';
import axios from '../services/storeAxios.service';
import multer from 'multer';
import {authenticate} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {basicAuthorization} from '../services/basicAuthorize';
import {SecurityBindings, UserProfile} from '@loopback/security';

// import {inject} from '@loopback/core';

export class LocationUserController {
  constructor(
    @inject(RestBindings.Http.RESPONSE) public response: Response,
    @inject(RestBindings.Http.REQUEST) public request: Request,
  ) {}

  @authenticate('jwt')
  @authorize({voters: [basicAuthorization], allowedRoles: ['customer']})
  @post('location-users/create', {
    responses: {
      '200': {
        description: 'Return location info',
        content: {
          'application/json': {
            schema: {
              type: 'LOCATION',
            },
          },
        },
      },
    },
  })
  async createLocationUser(
    @inject(SecurityBindings.USER)
    currentUser: UserProfile,
    @requestBody({
      description: 'create location user',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              address: {type: 'string'},
              isDefaultOnline: {type: 'boolean'},
              isDefaultKiot: {type: 'boolean'},
              province: {type: 'string'},
              district: {type: 'string'},
              ward: {type: 'string'},
              phoneNumber: {type: 'string'},
              name: {type: 'string'} 
            },
          },
        },
      },
    })
    request: any,
  ): Promise<any> {
    const idOfUser = currentUser.id;
    const {address, isDefaultOnline, isDefaultKiot, province, district, ward, phoneNumber, name} =
      request;
    const data = await axios
      .post(`/location-users/${idOfUser}`, {
        address,
        isDefaultOnline,
        isDefaultKiot,
        province,
        district,
        ward,
        name,
        phoneNumber
      })
      .then(res => res)
      .catch(e => console.log(e));

    return data;
  }

  @authenticate('jwt')
  @authorize({voters: [basicAuthorization], allowedRoles: ['customer']})
  @get('location-users', {
    responses: {
      '200': {
        description: 'Return location info',
        content: {
          'application/json': {
            schema: {
              type: 'LOCATION',
            },
          },
        },
      },
    },
  })
  async getAllLocaiton(
    @inject(SecurityBindings.USER)
    currentUser: UserProfile,
    @param.query.object('filter') filter: any,
  ): Promise<any> {
    const idOfUser = currentUser.id;

    let where: any;
    if (filter) {
      where = filter?.where || {};
      where = {...where, idOfUser};
      filter.where = where;
    }
    const data = await axios
      .get(`/location-users`, {
        params: {
          filter,
        },
      })
      .then(res => res)
      .catch(e => console.log(e));

    return data;
  }

  @authenticate('jwt')
  @authorize({voters: [basicAuthorization], allowedRoles: ['customer']})
  @post('location-users/update/{id}', {
    responses: {
      '200': {
        description: 'Return location info',
        content: {
          'application/json': {
            schema: {
              type: 'LOCATION',
            },
          },
        },
      },
    },
  })
  async updateLocationUser(
    @param.path.string('id') id: string,
    @inject(SecurityBindings.USER)
    currentUser: UserProfile,
    @requestBody({
      description: 'create location user',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              address: {type: 'string'},
              isDefaultOnline: {type: 'boolean'},
              isDefaultKiot: {type: 'boolean'},
              province: {type: 'string'},
              district: {type: 'string'},
              ward: {type: 'string'},
              phoneNumber: {type: 'string'},
              name: {type: 'string'} 
            },
          },
        },
      },
    })
    request: any,
  ): Promise<any> {
    const idOfUser = currentUser.id;
    const {address, isDefaultOnline, isDefaultKiot, province, district, ward, phoneNumber, name} =
      request;
    const data = await axios
      .patch(`/location-users/${idOfUser}/location-id/${id}`, {
        address,
        isDefaultOnline,
        isDefaultKiot,
        province,
        district,
        ward,
        phoneNumber,
        name
      })
      .then(res => res)
      .catch(e => console.log(e));

    return data;
  }
}
