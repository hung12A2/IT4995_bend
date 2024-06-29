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
      .then(res => res)
      .catch(e => console.log(e));

    return data;
  }

  @authenticate('jwt')
  @authorize({voters: [basicAuthorization], allowedRoles: ['employee']})
  @get('productsForShop/', {
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
    const data = await storeAxios
      .get(`/products`, {
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
  @authorize({voters: [basicAuthorization], allowedRoles: ['employee']})
  @get('productsForShop/count', {
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
  async countForShop(
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
    const data = await storeAxios
      .get(`/products/count`, {
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
  @authorize({voters: [basicAuthorization], allowedRoles: ['employee']})
  @get('productsForShop/{id}', {
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
  async getOneForShop(@param.path.string('id') id: string): Promise<any> {
    const data = await storeAxios
      .get(`/products/${id}`, {
        headers: {
          authorization: `${this.request.headers.authorization}`,
        },
      })
      .then(res => res)
      .catch(e => console.log(e));

    return data;
  }

  @get('products/count', {
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
  async count(@param.query.object('filter') filter: string): Promise<any> {
    const data = await storeAxios
      .get(`/products/count`, {
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

  @get('products/{id}', {
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
  async getOne(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter: string,
  ): Promise<any> {
    const data = await storeAxios
      .get(`/products/${id}`, {
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

  @post('products/banned/{id}', {
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
  async Banned(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter: string,
  ): Promise<any> {
    const data = await storeAxios
      .post(`/products/banned/${id}`, {
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

  @post('products/unbanned/{id}', {
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
  async unbanned(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter: string,
  ): Promise<any> {
    const data = await storeAxios
      .post(`/products/unbanned/${id}`, {
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

  @post('products/inActive/{id}', {
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
  async inActive(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter: string,
  ): Promise<any> {
    const data = await storeAxios
      .post(`/products/inActive/${id}`, {
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
    allowedRoles: ['employee'],
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
  async productUpdate(
    @param.path.string('id') id: string,
    @param.path.string('idOfCategory') idOfCategory: string,
    @inject(SecurityBindings.USER) currentUser: UserProfile,
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


    const idOfShop = currentUser.idOfShop;
    let formData = new FormData();
    if (data.files.images?.length > 0) {
      data.files.images?.forEach((image: any) => {
        formData.append('images', image.buffer, {
          filename: image.originalname,
        });
      });
    }

    if (currentUser.idOfKiot) {
      formData.append('idOfKiot', currentUser.idOfKiot);
    }

    if (!currentUser.idOfKiot && data.body.isKiotProduct== true) {
      return {
        code: 400,
        message: 'You are not allowed to create kiot product',
      };
    }

    formData.append('isOnlineProduct', data.body.isOnlineProduct);
    formData.append('isKiotProduct', data.body.isKiotProduct);
    formData.append('price', data.body?.price);
    formData.append('productDetails', data.body.productDetails);
    formData.append('countInStock', data.body.countInStock);
    formData.append('isBestSeller', data.body.isBestSeller);
    formData.append('weight', data.body.weight);
    formData.append('dimension', data.body.dimension);

    let array = [];

    if (data.body.oldImages) {
      if (Array.isArray(data.body.oldImages)) {
        if (data.body.oldImages.length > 0) {
          data.body.oldImages.forEach((image: any, index: number) => {
            formData.append(`oldImages`, image);
          });
        } else {
          array.push(data.body.oldImages);
          formData.append('oldImages', JSON.stringify(array));
        }
      } else {
        // If it's not an array, append it directly (or handle as error if expected to always be an array)
        array.push(data.body.oldImages);
        formData.append('oldImages', JSON.stringify(array));
      }
    }

    const dataReturn = await storeAxios
      .patch(
        `/products/shop/${idOfShop}/category/${idOfCategory}/${id}`,
        formData,
        {
          headers: {
            'Content-Type': `multipart/form-data`,
            authorization: `${this.request.headers.authorization}`,
          },
        },
      )
      .then(res => res)
      .catch(e => console.log(e));


    return dataReturn;
  }
}
