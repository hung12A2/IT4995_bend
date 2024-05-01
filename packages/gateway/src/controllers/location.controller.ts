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

// import {inject} from '@loopback/core';

export class LocationController {
  constructor(
    @inject(RestBindings.Http.RESPONSE) public response: Response,
    @inject(RestBindings.Http.REQUEST) public request: Request,
  ) {}

  @post('location/province', {
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
  async getProvince(): Promise<any> {
    const data = await axios
      .get(`/location/province`)
      .then(res => res)
      .catch(e => console.log(e));

    return data;
  }

  @post('location/district/{idOfProvince}', {
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
  async getDistrict(
    @param.path.string('idOfProvince') idOfProvince: string,
  ): Promise<any> {
    const data = await axios
      .get(`/location/province/${idOfProvince}`)
      .then(res => res)
      .catch(e => console.log(e));

    return data;
  }

  @post('location/ward/{idOfDistrict}', {
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
  async getWard(
    @param.path.string('idOfDistrict') idOfDistrict: string,
  ): Promise<any> {
    const data = await axios
      .get(`/location/province/distric/${idOfDistrict}`)
      .then(res => res)
      .catch(e => console.log(e));

    return data;
  }
}
