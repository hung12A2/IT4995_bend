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

export class EmployeeController {
  constructor(
    @inject(RestBindings.Http.RESPONSE) public response: Response,
    @inject(RestBindings.Http.REQUEST) public request: Request,
  ) {}

  @authenticate('jwt')
  @authorize({voters: [basicAuthorization], allowedRoles: ['customer']})
  @post('employees/create', {
    responses: {
      '200': {
        description: 'Return new employee',
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
  async createEmployee(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              email: {type: 'string'},
              name: {type: 'string'},
              permissions: {type: 'string'},
              phoneNumber: {type: 'string'},
            },
          },
        },
      },
    })
    employee: any,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise<any> {
    const data = axios
      .post('/employees', employee, {
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
  @post('areas/update/{id}', {
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
}
