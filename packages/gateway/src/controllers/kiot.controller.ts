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
  patch,
} from '@loopback/rest';
import {authenticate} from '@loopback/authentication';
import axios from '../services/authAxios.service';
import multer from 'multer';
import FormData from 'form-data';
import {authorize} from '@loopback/authorization';
import {basicAuthorization} from '../services/basicAuthorize';
import {SecurityBindings, UserProfile} from '@loopback/security';

const storage = multer.memoryStorage();
const upload = multer({storage});

var cpUpload = upload.fields([{name: 'IDcardImg'}, {name: 'BLicenseImg'}]);
// import {inject} from '@loopback/core';

export class KiotController {
  constructor(
    @inject(RestBindings.Http.RESPONSE) public response: Response,
    @inject(RestBindings.Http.REQUEST) public request: Request,
  ) {}

  @authenticate('jwt')
  @post('kiots/create/area/{idOfArea}', {
    responses: {
      '200': {
        description: 'Return avatar user',
        content: {
          'application/json': {
            schema: {
              type: 'USER',
            },
          },
        },
      },
    },
  })
  async createKiot(
    @param.path.string('idOfArea') idOfArea: string,
    @requestBody({
      description: 'multipart/form-data value.',
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              name: {type: 'string'},
              description: {type: 'string'},
              pickUpAddress: {type: 'string'},
              returnAddress: {type: 'string'},
              pickUpProvince: {type: 'string'},
              returnProvince: {type: 'string'},
              pickUpDistrict: {type: 'string'},
              returnDistrict: {type: 'string'},
              pickUpWard: {type: 'string'},
              returnWard: {type: 'string'},
              phoneNumber: {type: 'string'},
              email: {type: 'string'},
            },
          },
        },
      },
    })
    request: Request,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise<any> {
    const data = axios
      .post(`/kiots/area/${idOfArea}`, request, {
        headers: {
          authorization: this.request.headers.authorization,
        },
      })
      .then(res => res)
      .catch(e => console.log(e));

    return data;
  }

  @get('kiots/', {
    responses: {
      '200': {
        description: 'Return kiot details',
        content: {
          'application/json': {
            schema: {
              type: 'USER',
            },
          },
        },
      },
    },
  })
  async getAllKiot(@param.query.object('filter') filter: object): Promise<any> {
    const data = axios
      .get(`/kiots`, {
        params: {
          filter,
        },
      })
      .then(res => res)
      .catch(e => console.log(e));

    return data;
  }

  @get('kiots/count', {
    responses: {
      '200': {
        description: 'Return kiot details',
        content: {
          'application/json': {
            schema: {
              type: 'USER',
            },
          },
        },
      },
    },
  })
  async countKiot(@param.query.object('filter') filter: object): Promise<any> {
    const data = axios
      .get(`/kiots/count`, {
        params: {
          filter,
        },
      })
      .then(res => res)
      .catch(e => console.log(e));

    return data;
  }

  @post('kiots/banned/{id}', {
    responses: {
      '200': {
        description: 'Return kiot details',
        content: {
          'application/json': {
            schema: {
              type: 'USER',
            },
          },
        },
      },
    },
  })
  async bannedKiot(@param.path.string('id') id: string): Promise<any> {
    const data = axios
      .post(`/kiots/banned/${id}`)
      .then(res => res)
      .catch(e => console.log(e));

    return data;
  }

  @post('kiots/unbanned/{id}', {
    responses: {
      '200': {
        description: 'Return kiot details',
        content: {
          'application/json': {
            schema: {
              type: 'USER',
            },
          },
        },
      },
    },
  })
  async unbannedKiot(@param.path.string('id') id: string): Promise<any> {
    const data = axios
      .post(`/kiots/unbanned/${id}`)
      .then(res => res)
      .catch(e => console.log(e));

    return data;
  }


  @get('kiots/{id}', {
    responses: {
      '200': {
        description: 'Return kiot details',
        content: {
          'application/json': {
            schema: {
              type: 'USER',
            },
          },
        },
      },
    },
  })
  async getOneKiot(@param.path.string('id') id: string): Promise<any> {
    const data = axios
      .get(`/kiots/${id}`)
      .then(res => res)
      .catch(e => console.log(e));

    return data;
  }

  @authenticate('jwt')
  @authorize({voters: [basicAuthorization], allowedRoles: ['customer']})
  @post('kiots/update/area/{idOfArea}', {
    responses: {
      '200': {
        description: 'Return avatar user',
        content: {
          'application/json': {
            schema: {
              type: 'USER',
            },
          },
        },
      },
    },
  })
  async updateKiot(
    @param.path.string('idOfArea') idOfArea: string,
    @requestBody({
      description: 'multipart/form-data value.',
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              name: {type: 'string'},
              description: {type: 'string'},
              pickUpAddress: {type: 'string'},
              returnAddress: {type: 'string'},
              pickUpProvince: {type: 'string'},
              returnProvince: {type: 'string'},
              pickUpDistrict: {type: 'string'},
              returnDistrict: {type: 'string'},
              pickUpWard: {type: 'string'},
              returnWard: {type: 'string'},
              phoneNumber: {type: 'string'},
              email: {type: 'string'},
            },
          },
        },
      },
    })
    request: Request,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise<any> {
    const data = axios
      .patch(`/kiots/area/${idOfArea}`, request, {
        headers: {
          authorization: this.request.headers.authorization,
        },
      })
      .then(res => res)
      .catch(e => console.log(e));

    return data;
  }

  @authenticate('jwt')
  @authorize({voters: [basicAuthorization], allowedRoles: ['customer']})
  @patch('/kiots')
  @response(204, {
    description: 'Store PATCH success',
  })
  async updateById(
    @inject(SecurityBindings.USER)
    currentUser: UserProfile,
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
          },
        },
      },
    })
    store: any,
  ): Promise<any> {
    const {
      name,
      description,
      pickUpAddress,
      returnAddress,
      pickUpProvince,
      returnProvince,
      pickUpDistrict,
      returnDistrict,
      pickUpWard,
      returnWard,
      phoneNumber,
      idOfArea,
    } = store;

    console.log({
      name,
      description,
      pickUpAddress,
      returnAddress,
      pickUpProvince,
      returnProvince,
      pickUpDistrict,
      returnDistrict,
      pickUpWard,
      returnWard,
      phoneNumber,
    });

    const data = await axios
      .patch(
        `/kiots/area/${idOfArea}`,
        {
          name,
          description,
          pickUpAddress,
          returnAddress,
          pickUpProvince,
          returnProvince,
          pickUpDistrict,
          returnDistrict,
          pickUpWard,
          returnWard,
          phoneNumber,
        },
        {
          headers: {
            Authorization: this.request.headers.authorization,
          },
        },
      )
      .then(res => res)
      .catch(e => console.log(e));

    return data;
  }
}
