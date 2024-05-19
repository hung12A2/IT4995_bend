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

export class RequestCreateProductController {
  constructor(
    @inject(RestBindings.Http.RESPONSE) public response: Response,
    @inject(RestBindings.Http.REQUEST) public request: Request,
  ) {}

  @authenticate('jwt')
  @authorize({
    voters: [basicAuthorization],
    allowedRoles: ['employee'],
  })
  @post('request-create-products/create/category/{idOfCategory}', {
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

    data.files.images.forEach((image: any) => {
      formData.append('images', image.buffer, {
        filename: image.originalname,
      });
    });

    if (currentUser.idOfKiot) {
      formData.append('idOfKiot', currentUser.idOfKiot);
    }

    if (!currentUser.idOfKiot && data.body.isKiotProduct) {
      return {
        code: 400,
        message: 'You are not allowed to create kiot product',
      };
    }

    formData.append('isOnlineProduct', data.body.isOnlineProduct);
    formData.append('isKiotProduct', data.body.isKiotProduct);
    formData.append('name', data.body.name);
    formData.append('price', data.body.price);
    formData.append('productDescription', data.body.productDescription);
    formData.append('productDetails', data.body.productDetails);
    formData.append('countInStock', data.body.countInStock);
    formData.append('isBestSeller', data.body.isBestSeller);
    formData.append('weight', data.body.weight);
    formData.append('dimension', data.body.dimension);

    const dataReturn = await storeAxios
      .post(
        `/request-create-product/shop/${idOfShop}/category/${idOfCategory}`,
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

  @authenticate('jwt')
  @authorize({
    voters: [basicAuthorization],
    allowedRoles: ['employee'],
  })
  @post('request-create-products/update/category/{idOfCategory}/{id}', {
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
  async requestCreateProductupdate(
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

    if (!currentUser.idOfKiot && data.body.isKiotProduct) {
      return {
        code: 400,
        message: 'You are not allowed to create kiot product',
      };
    }

    formData.append('isOnlineProduct', data.body.isOnlineProduct);
    formData.append('isKiotProduct', data.body.isKiotProduct);

    formData.append('name', data.body?.name);

    formData.append('price', data.body?.price);

    formData.append('productDescription', data.body.productDescription);
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
        `/request-create-product/shop/${idOfShop}/category/${idOfCategory}/${id}`,
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

  @authenticate('jwt')
  @authorize({
    voters: [basicAuthorization],
    allowedRoles: ['admin', 'product-Managment'],
  })
  @post('request-create-products/accepted/{idOfRequest}', {
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
  async acceptedCreateProduct(
    @param.path.string('idOfRequest') idOfRequest: string,
    @inject(SecurityBindings.USER) currentUser: UserProfile,
  ): Promise<any> {
    const idOfAdmin = currentUser.id;
    const data = storeAxios
      .post(
        `/request-create-product/${idOfRequest}/accepted/admin/${idOfAdmin}`,
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
    allowedRoles: ['admin', 'product-Managment'],
  })
  @post('request-create-products/rejected/{idOfRequest}', {
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
  async rejected(
    @param.path.string('idOfRequest') idOfRequest: string,
    @inject(SecurityBindings.USER) currentUser: UserProfile,
  ): Promise<any> {
    const idOfAdmin = currentUser.id;
    const data = storeAxios
      .post(
        `/request-create-product/${idOfRequest}/rejected/admin/${idOfAdmin}`,
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
    allowedRoles: ['admin'],
  })
  @get('request-create-products/', {
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
      .get(`/request-create-product`, {
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
  @get('request-create-products-for-shop/', {
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
    @param.query.object('filter') filter: any,
    @inject(SecurityBindings.USER) currentUser: UserProfile,
  ): Promise<any> {
    const idOfShop = currentUser.idOfShop;
    let where: any;
    if (filter) {
      where = filter?.where || {};
      where = {...where, idOfShop};
      filter.where = where;
    }
    const data = await storeAxios
      .get(`/request-create-product`, {
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
  @get('request-create-products-for-shop/count', {
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
  async countAllForSho(
    @param.query.object('filter') filter: any,
    @inject(SecurityBindings.USER) currentUser: UserProfile,
  ): Promise<any> {
    const idOfShop = currentUser.idOfShop;
    let where: any;
    if (filter) {
      where = filter?.where || {};
      where = {...where, idOfShop};
      filter.where = where;
    }
    const data = await storeAxios
      .get(`/request-create-product/count`, {
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
  @get('request-create-products-for-shop/{id}', {
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
      .get(`/request-create-product/${id}`, {
        headers: {
          authorization: `${this.request.headers.authorization}`,
        },
      })
      .then(res => res)
      .catch(e => console.log(e));

    return data;
  }

  @authenticate('jwt')
  @authorize({
    voters: [basicAuthorization],
    allowedRoles: ['admin'],
  })
  @get('request-create-products/{id}', {
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
  async getOne(@param.path.string(`id`) id: string): Promise<any> {
    const data = await storeAxios
      .get(`/request-create-product/${id}`)
      .then(res => res)
      .catch(e => console.log(e));

    return data;
  }

  @authenticate('jwt')
  @authorize({
    voters: [basicAuthorization],
    allowedRoles: ['admin', 'product-Managment'],
  })
  @get('request-create-products/count', {
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
      .get(`/request-create-product/count`, {
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
}
