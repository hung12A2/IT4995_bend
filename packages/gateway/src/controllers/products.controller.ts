// Uncomment these imports to begin using these cool features!

// import {inject} from '@loopback/core';

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
import storeAxios from '../services/storeAxios.service';
import multer from 'multer';
import FormData from 'form-data';
import {authorize} from '@loopback/authorization';
import {basicAuthorization} from '../services/basicAuthorize';
import {SecurityBindings, UserProfile} from '@loopback/security';

const storage = multer.memoryStorage();
const upload = multer({storage});

var cpUpload = upload.fields([{name: 'images'}]);
// import {inject} from '@loopback/core';

export class ProductsController {
  constructor(
    @inject(RestBindings.Http.RESPONSE) public response: Response,
    @inject(RestBindings.Http.REQUEST) public request: Request,
  ) {}

  @get('products/', {
    responses: {
      '200': {
        description: 'Return all request products',
        content: {
          'application/json': {
            schema: {
              type: 'PRODUCT',
            },
          },
        },
      },
    },
  })
  async getAll(@param.query.object('filter') filter: string): Promise<any> {
    const data = await storeAxios
      .get(`/products`, {
        headers: {
          authorization: `${this.request.headers.authorization}`,
        },
        params: {
          filter,
        },
      })
      .then(res => res.data)
      .catch(e => console.log(e));

    this.response.header('Access-Control-Expose-Headers', 'Content-Range');
    this.response.header('Content-Range', 'Products 0-20/20');
    this.response.status(200).send(data);
  }

  @authenticate('jwt')
  @authorize({
    voters: [basicAuthorization],
    allowedRoles: ['employee', 'product-Managment'],
  })
  @post('products/update/category/{idOfCategory}/{id}', {
    responses: {
      '200': {
        description: 'Return new request products',
        content: {
          'application/json': {
            schema: {
              type: 'PRODUCT',
            },
          },
        },
      },
    },
  })
  async requestCreateProduct(
    @param.path.string('id') id: string,
    @param.path.string('idOfCategory') idOfCategory: string,
    @inject(SecurityBindings.USER) currentUser: UserProfile,
    @requestBody({
      description: 'multipart/form-data value.',
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              price: {type: 'number'},
              countInStock: {type: 'number'},
              isBestSeller: {type: 'boolean'},
              weight: {type: 'number'},
              dimension: {type: 'string'},
              status: {type: 'string'},
              isKiotProduct: {type: 'boolean'},
              isOnlineProduct: {type: 'boolean'},
            },
          },
        },
      },
    })
    request: any,
  ): Promise<any> {
    const {
      isKiotProduct,
    } = request;
    const idOfKiot = currentUser.idOfKiot;
    if (!idOfKiot && isKiotProduct) {
      return {
        code: 400,
        message: 'idOfKiot is required',
      };
    }

    if (isKiotProduct && idOfKiot) {
      request.idOfKiot = idOfKiot;
    }

    const idOfShop = currentUser.idOfShop;

    const data = await storeAxios.patch(
      `products/shop/${idOfShop}/category/${idOfCategory}/${id}`,
      request,
      {
        headers: {
          authorization: `${this.request.headers.authorization}`,
        },
      },
    );

    return data
  }
}
