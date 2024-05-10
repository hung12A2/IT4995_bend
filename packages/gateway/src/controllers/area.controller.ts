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
import {authenticate} from '@loopback/authentication';
import axios from '../services/authAxios.service';
import multer from 'multer';
import {authorize} from '@loopback/authorization';
import {basicAuthorization} from '../services/basicAuthorize';

const storage = multer.memoryStorage();
const upload = multer({storage});

var cpUpload = upload.fields([{name: 'IDcardImg'}, {name: 'BLicenseImg'}]);
// import {inject} from '@loopback/core';

export class AreaController {
  constructor(
    @inject(RestBindings.Http.RESPONSE) public response: Response,
    @inject(RestBindings.Http.REQUEST) public request: Request,
  ) {}

  @authenticate('jwt')
  @post('areas', {
    responses: {
      '200': {
        description: 'Return new area',
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
      },
    },
  })
  async createArea(
    @requestBody({
      description: 'new area data',
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              name: {type: 'string'},
              province: {type: 'string'},
              district: {type: 'string'},
            },
          },
        },
      },
    })
    request: Request,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise<any> {
    const data = axios
      .post('/areas', request, {
        headers: {
          authorization: this.request.headers.authorization,
        },
      })
      .then(res => res)
      .catch(e => console.log(e));

    return data;
  }

  @authenticate('jwt')
  @authorize({
    voters: [basicAuthorization],
    allowedRoles: ['admin', 'area-Managment'],
  })
  @post('areas/{id}', {
    responses: {
      '200': {
        description: 'Return new area',
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
      },
    },
  })
  async updateArea(
    @param.path.string('id') id: string,
    @requestBody({
      description: 'new area data',
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              name: {type: 'string'},
              province: {type: 'string'},
              district: {type: 'string'},
            },
          },
        },
      },
    })
    request: Request,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise<any> {
    const data = axios
      .patch(`/areas/${id}`, request, {
        headers: {
          authorization: this.request.headers.authorization,
        },
      })
      .then(res => res)
      .catch(e => console.log(e));

    return data;
  }

  @get('areas', {
    responses: {
      '200': {
        description: 'Return new area',
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
      },
    },
  })
  async getAllAreas(
    @param.query.object('filter') filter: string,
  ): Promise<any> {
    const data = axios
      .get(`/areas`, {
        params: {
          filter,
        },
      })
      .then(res => res)
      .catch(e => console.log(e));

    return data;
  }

  @get('areas/count', {
    responses: {
      '200': {
        description: 'Return new area',
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
      },
    },
  })
  async count(
    @param.query.object('filter') filter: string,
  ): Promise<any> {
    const data = axios
      .get(`/areas/count`, {
        params: {
          filter,
        },
      })
      .then(res => res)
      .catch(e => console.log(e));

    return data;
  }

  @get('areas/{id}', {
    responses: {
      '200': {
        description: 'Return new area',
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
      },
    },
  })
  async getOneAreas(
    @param.path.string('id') id: string,
  ): Promise<any> {
    const data = axios
      .get(`/areas/${id}` )
      .then(res => res)
      .catch(e => console.log(e));

    return data;
  }
}
