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
import FormData from 'form-data';
import {authorize} from '@loopback/authorization';
import {basicAuthorization} from '../services/basicAuthorize';

const storage = multer.memoryStorage();
const upload = multer({storage});

var cpUpload = upload.fields([{name: 'IDcardImg'}, {name: 'BLicenseImg'}]);
// import {inject} from '@loopback/core';

export class ReqCreateShopController {
  constructor(
    @inject(RestBindings.Http.RESPONSE) public response: Response,
    @inject(RestBindings.Http.REQUEST) public request: Request,
  ) {}

  @authenticate('jwt')
  @post('request-create-shop/create', {
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
  async requestCreateShop(
    @requestBody({
      description: 'multipart/form-data value.',
      required: true,
      content: {
        'multipart/form-data': {
          // Skip body parsing
          'x-parser': 'stream',
          schema: {type: 'object'},
        },
      },
    })
    request: Request,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise<any> {
    const data: any = await new Promise<object>((resolve, reject) => {
      cpUpload(request, response, (err: unknown) => {
        if (err) reject(err);
        else {
          resolve({
            files: request.files,
            body: request.body,
          });
        }
      });
    });

    let formData = new FormData();
    formData.append('IDcardImg', data.files.IDcardImg[0].buffer, {
      filename: data.files.IDcardImg[0].originalname,
    });
    formData.append('BLicenseImg', data.files.BLicenseImg[0].buffer, {
      filename: data.files.BLicenseImg[0].originalname,
    });
    formData.append('pickUpAddress', data.body.pickUpAddress);
    formData.append('returnAddress', data.body.returnAddress);
    formData.append('phoneNumber', data.body.phoneNumber);
    formData.append('email', data.body.email);
    formData.append('name', data.body.name);
    formData.append('pickUpProvince', data.body.pickUpProvince);
    formData.append('pickUpDistrict', data.body.pickUpDistrict);
    formData.append('pickUpWard', data.body.pickUpWard);
    formData.append('returnProvince', data.body.returnProvince);
    formData.append('returnDistrict', data.body.returnDistrict);
    formData.append('returnWard', data.body.returnWard);

    const dataReturn = await axios
      .post('/request-create-shops', formData, {
        headers: {
          'Content-Type': `multipart/form-data`,
          authorization: `${this.request.headers.authorization}`,
        },
      })
      .then(res => res)
      .catch(e => console.log(e));

    return dataReturn;
  }

  @authenticate('jwt')
  @authorize({voters:[basicAuthorization], allowedRoles: ['customer']})
  @post('request-create-shop/update', {
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
  async updateCreateShop(
    @requestBody({
      description: 'multipart/form-data value.',
      required: true,
      content: {
        'multipart/form-data': {
          // Skip body parsing
          'x-parser': 'stream',
          schema: {type: 'object'},
        },
      },
    })
    request: Request,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise<any> {
    const data: any = await new Promise<object>((resolve, reject) => {
      cpUpload(request, response, (err: unknown) => {
        if (err) reject(err);
        else {
          resolve({
            files: request.files,
            body: request.body,
          });
        }
      });
    });

    let formData = new FormData();
    if (data.files.IDcardImg)
      formData.append('IDcardImg', data.files.IDcardImg[0].buffer, {
        filename: data.files.IDcardImg[0].originalname,
      });
    if (data.files.BLicenseImg)
      formData.append('BLicenseImg', data.files.BLicenseImg[0].buffer, {
        filename: data.files.BLicenseImg[0].originalname,
      });
    if (data.body.pickUpAddress)
      formData.append('pickUpAddress', data.body.pickUpAddress);
    if (data.body.returnAddress)
      formData.append('returnAddress', data.body.returnAddress);
    if (data.body.phoneNumber)
      formData.append('phoneNumber', data.body.phoneNumber);
    if (data.body.email) formData.append('email', data.body.email);
    if (data.body.name) formData.append('name', data.body.name);
    if (data.body.pickUpProvince)
      formData.append('pickUpProvince', data.body.pickUpProvince);
    if (data.body.pickUpDistrict)
      formData.append('pickUpDistrict', data.body.pickUpDistrict);
    if (data.body.pickUpWard)
      formData.append('pickUpWard', data.body.pickUpWard);
    if (data.body.returnProvince)
      formData.append('returnProvince', data.body.returnProvince);
    if (data.body.returnDistrict)
      formData.append('returnDistrict', data.body.returnDistrict);
    if (data.body.returnWard)
      formData.append('returnWard', data.body.returnWard);

    const dataReturn = await axios
      .patch('/request-create-shops', formData, {
        headers: {
          'Content-Type': `multipart/form-data`,
          authorization: `${this.request.headers.authorization}`,
        },
      })
      .then(res => res)
      .catch(e => console.log(e));

    return dataReturn;
  }

  @authenticate('jwt')
  @authorize({
    voters: [basicAuthorization],
    allowedRoles: ['admin', 'reqCreateShop-Managment'],
  })
  @post('request-create-shop/accepted/{idOfRequest}', {
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
  async acceptedReq(
    @param.path.string('idOfRequest') idOfRequest: string,
  ): Promise<any> {
    const data = await axios
      .post(
        `/request-create-shops/accepted/${idOfRequest}`,
        {},
        {
          headers: {
            authorization: `${this.request.headers.authorization}`,
          },
        },
      )
      .then(res => res)
      .catch(e => console.log(e));

    return data;
  }

  @authenticate('jwt')
  @authorize({
    voters: [basicAuthorization],
    allowedRoles: ['admin', 'reqCreateShop-Managment'],
  })
  @get('request-create-shop', {
    responses: {
      '200': {
        description: 'Return all request create shop',
        content: {
          'application/json': {
            schema: {
              type: 'REQ-SHOP',
            },
          },
        },
      },
    },
  })
  async getAllReq(@param.query.object('filter') filter: string): Promise<any> {
    const data = await axios
      .get(`/request-create-shops`, {
        headers: {
          authorization: `${this.request.headers.authorization}`,
        },
        params: {
          filter,
        },
      })
      .then(res => res)
      .catch(e => console.log(e));

    return data;
  }

  @authenticate('jwt')
  @authorize({
    voters: [basicAuthorization],
    allowedRoles: ['admin', 'reqCreateShop-Managment'],
  })
  @post('request-create-shop/rejected/{idOfRequest}', {
    responses: {
      '200': {
        description: 'Return all request create shop',
        content: {
          'application/json': {
            schema: {
              type: 'REQ-SHOP',
            },
          },
        },
      },
    },
  })
  async rejectedRequest(
    @param.path.string('idOfRequest') idOfRequest: string,
  ): Promise<any> {
    const data = await axios
      .post(
        `/request-create-shops/reject/${idOfRequest}`,
        {},
        {
          headers: {
            authorization: `${this.request.headers.authorization}`,
          },
        },
      )
      .then(res => res)
      .catch(e => console.log(e));

    return data;
  }


  @get('test', {
    responses: {
      '200': {
        description: 'Return all request create shop',
        content: {
          'application/json': {
            schema: {
              type: 'REQ-SHOP',
            },
          },
        },
      },
    },
  })
  async test(): Promise<any> { 
    const data = new Date().toLocaleString();
   return(data);
  }
}
