// Uncomment these imports to begin using these cool features!

// import {inject} from '@loopback/core';
//

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
import FormData from 'form-data';

const storage = multer.memoryStorage();
const upload = multer({storage});

var cpUpload = upload.fields([{name: 'images'}]);

export class OrderKiotController {
  constructor(
    @inject(RestBindings.Http.RESPONSE) public response: Response,
    @inject(RestBindings.Http.REQUEST) public request: Request,
  ) {}

  @authenticate('jwt')
  @authorize({
    voters: [basicAuthorization],
    allowedRoles: ['employee', 'orderKiot-Managment'],
  })
  @post('order-kiot/create/shop/{idOfShop}/kiot/{idOfKiot}', {
    responses: {
      '200': {
        description: 'Return new orderKiot',
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
  async create(
    @param.path.string('idOfKiot') idOfKiot: string,
    @param.path.string('idOfShop') idOfShop: string,
    @inject(SecurityBindings.USER)
    currentUser: UserProfile,
    @requestBody({
      description: 'add products to cart',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              fromName: {type: 'string'},
              toName: {type: 'string'},
              fromPhone: {type: 'string'},
              toPhone: {type: 'string'},
              fromAddress: {type: 'string'},
              toAddress: {type: 'string'},
              fromProvince: {type: 'string'},
              toProvince: {type: 'string'},
              fromDistrict: {type: 'string'},
              toDistrict: {type: 'string'},
              fromWard: {type: 'string'},
              toWard: {type: 'string'},
              content: {type: 'string'},
              priceOfAll: {type: 'number'},
              paymentMethod: {type: 'string'},
              note: {type: 'string'},
              requiredNote: {type: 'string'},
              distance: {type: 'number'},
              totalFee: {type: 'number'},
              items: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    idOfProduct: {type: 'string'},
                    quantity: {type: 'number'},
                  },
                },
              },
            },
          },
        },
      },
    })
    request: any,
  ): Promise<any> {
    const idOfUser = currentUser.id;
    const {
      fromName,
      toName,
      fromPhone,
      toPhone,
      fromAddress,
      toAddress,
      fromProvince,
      toProvince,
      fromDistrict,
      toDistrict,
      fromWard,
      toWard,
      content,
      priceOfAll,
      paymentMethod,
      note,
      requiredNote,
      items,
      distance,
      totalFee,
      
    } = request;
    const data = axios
      .post(
        `/ordersOfKiot/create/${idOfUser}/shop/${idOfShop}/kiot/${idOfKiot}`,
        {
          fromName,
          toName,
          fromPhone,
          toPhone,
          fromAddress,
          toAddress,
          fromProvince,
          toProvince,
          fromDistrict,
          toDistrict,
          fromWard,
          toWard,
          content,
          priceOfAll,
          paymentMethod,
          note,
          requiredNote,
          items,
          distance,
          totalFee,
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

  @post('order-kiot/preview', {
    responses: {
      '200': {
        description: 'Return new orderKiot',
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
  async preview(
    @requestBody({
      description: 'add products to cart',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              fromAddress: {type: 'string'},
              toAddress: {type: 'string'},
              fromProvince: {type: 'string'},
              toProvince: {type: 'string'},
              fromDistrict: {type: 'string'},
              toDistrict: {type: 'string'},
              fromWard: {type: 'string'},
              toWard: {type: 'string'},
              items: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    idOfProduct: {type: 'string'},
                    quantity: {type: 'number'},
                  },
                },
              },
            },
          },
        },
      },
    })
    request: any,
  ): Promise<any> {
    const {
      fromAddress,
      toAddress,
      fromProvince,
      toProvince,
      fromDistrict,
      toDistrict,
      fromWard,
      toWard,
      items,
    } = request;
    const data = axios
      .post(`/ordersOfKiot/preview`, {
        fromAddress,
        toAddress,
        fromProvince,
        toProvince,
        fromDistrict,
        toDistrict,
        fromWard,
        toWard,
        items,
      })
      .then(res => res)
      .catch(e => console.log(e));

    return data;
  }

  @authenticate('jwt')
  @authorize({
    voters: [basicAuthorization],
    allowedRoles: ['employee', 'orderKiot-Managment'],
  })
  @post('order-kiot/accepted/order/{idOfOrder}', {
    responses: {
      '200': {
        description: 'Return order kiot info',
        content: {
          'application/json': {
            schema: {
              type: 'Product in cart',
            },
          },
        },
      },
    },
  })
  async acceptedOrder(
    @inject(SecurityBindings.USER)
    currentUser: UserProfile,
    @param.path.string('idOfOrder') idOfOrder: string,
    @requestBody({
      description: 'add products to cart',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              content: {type: 'string'},
              requiredNote: {type: 'string'}
            },
          },
        },
      },
    }) request: any
  ): Promise<any> {
    const idOfShop = currentUser.idOfShop;
    const content = request?.content
    const requiredNote = request?.requiredNote
    const data = await axios
      .post(`/ordersKiot/accepted/${idOfShop}/order-id/${idOfOrder}`, {
        content,
        requiredNote
      })
      .then(res => res)
      .catch(e => console.log(e));

    return data;
  }

  @authenticate('jwt')
  @authorize({
    voters: [basicAuthorization],
    allowedRoles: ['employee', 'orderKiot-Managment'],
  })
  @post('order-kiot/prepared/order/{idOfOrder}', {
    responses: {
      '200': {
        description: 'Return order kiot info',
        content: {
          'application/json': {
            schema: {
              type: 'Product in cart',
            },
          },
        },
      },
    },
  })
  async preparedOrder(
    @inject(SecurityBindings.USER)
    currentUser: UserProfile,
    @param.path.string('idOfOrder') idOfOrder: string,
  ): Promise<any> {
    const idOfShop = currentUser.idOfShop;
    const data = await axios
      .post(`/ordersKiot/prepared/${idOfShop}/order-id/${idOfOrder}`)
      .then(res => res)
      .catch(e => console.log(e));

    return data;
  }

  @authenticate('jwt')
  @authorize({
    voters: [basicAuthorization],
    allowedRoles: ['employee', 'orderKiot-Managment'],
  })
  @post('order-kiot/inTransit/order/{idOfOrder}', {
    responses: {
      '200': {
        description: 'Return order kiot info',
        content: {
          'application/json': {
            schema: {
              type: 'Product in cart',
            },
          },
        },
      },
    },
  })
  async inTransitOrder(
    @inject(SecurityBindings.USER)
    currentUser: UserProfile,
    @param.path.string('idOfOrder') idOfOrder: string,
  ): Promise<any> {
    const idOfShop = currentUser.idOfShop;
    const data = await axios
      .post(`/ordersKiot/inTransit/${idOfShop}/order-id/${idOfOrder}`)
      .then(res => res)
      .catch(e => console.log(e));

    return data;
  }

  @authenticate('jwt')
  @authorize({
    voters: [basicAuthorization],
    allowedRoles: ['employee', 'orderKiot-Managment'],
  })
  @post('order-kiot/deliverd/order/{idOfOrder}', {
    responses: {
      '200': {
        description: 'Return order kiot info',
        content: {
          'application/json': {
            schema: {
              type: 'Product in cart',
            },
          },
        },
      },
    },
  })
  async deliverdOrder(
    @inject(SecurityBindings.USER)
    currentUser: UserProfile,
    @param.path.string('idOfOrder') idOfOrder: string,
  ): Promise<any> {
    const idOfShop = currentUser.idOfShop;
    const data = await axios
      .post(`/ordersKiot/delivered/${idOfShop}/order-id/${idOfOrder}`)
      .then(res => res)
      .catch(e => console.log(e));

    return data;
  }

  @authenticate('jwt')
  @authorize({
    voters: [basicAuthorization],
    allowedRoles: ['employee', 'orderKiot-Managment'],
  })
  @post('order-kiot/rejected/order/{idOfOrder}', {
    responses: {
      '200': {
        description: 'Return order kiot info',
        content: {
          'application/json': {
            schema: {
              type: 'Product in cart',
            },
          },
        },
      },
    },
  })
  async rejectedOrder(
    @inject(SecurityBindings.USER)
    currentUser: UserProfile,
    @param.path.string('idOfOrder') idOfOrder: string,
  ): Promise<any> {
    const idOfShop = currentUser.idOfShop;
    const data = await axios
      .post(`/ordersKiot/rejected/${idOfShop}/order-id/${idOfOrder}`)
      .then(res => res)
      .catch(e => console.log(e));

    return data;
  }

  @authenticate('jwt')
  @authorize({
    voters: [basicAuthorization],
    allowedRoles: ['customer'],
  })
  @post('order-kiot/canceled/order/{idOfOrder}', {
    responses: {
      '200': {
        description: 'Return order kiot info',
        content: {
          'application/json': {
            schema: {
              type: 'Product in cart',
            },
          },
        },
      },
    },
  })
  async canceledOrder(
    @inject(SecurityBindings.USER)
    currentUser: UserProfile,
    @param.path.string('idOfOrder') idOfOrder: string,
  ): Promise<any> {
    const idOfUser = currentUser.id;
    const data = await axios
      .post(`/ordersKiot/canceled/${idOfUser}/order-id/${idOfOrder}`)
      .then(res => res)
      .catch(e => console.log(e));

    return data;
  }

  @authenticate('jwt')
  @authorize({
    voters: [basicAuthorization],
    allowedRoles: ['customer'],
  })
  @post('order-kiot/received/order/{idOfOrder}', {
    responses: {
      '200': {
        description: 'Return order kiot info',
        content: {
          'application/json': {
            schema: {
              type: 'Product in cart',
            },
          },
        },
      },
    },
  })
  async receivedOrder(
    @inject(SecurityBindings.USER)
    currentUser: UserProfile,
    @param.path.string('idOfOrder') idOfOrder: string,
  ): Promise<any> {
    const idOfUser = currentUser.id;
    const data = await axios
      .post(`/ordersKiot/received/${idOfUser}/order-id/${idOfOrder}`)
      .then(res => res)
      .catch(e => console.log(e));

    return data;
  }

  @authenticate('jwt')
  @authorize({
    voters: [basicAuthorization],
    allowedRoles: ['customer'],
  })
  @post('order-kiot/returned/order/{idOfOrder}', {
    responses: {
      '200': {
        description: 'Return order kiot info',
        content: {
          'application/json': {
            schema: {
              type: 'Product in cart',
            },
          },
        },
      },
    },
  })
  async returnedOrder(
    @inject(SecurityBindings.USER)
    currentUser: UserProfile,
    @param.path.string('idOfOrder') idOfOrder: string,
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
    const idOfUser = currentUser.id;

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
    if (!data.body.reason || !data.files.images) {
      return {
        code: 400,
        message: 'reason and images are required',
      };
    }

    formData.append('reason', data.body.reason);
    data.files.images.forEach((image: any) => {
      formData.append('images', image.buffer, {
        filename: image.originalname,
      });
    });

    const dataReturn = await axios
      .post(`/ordersKiot/returned/${idOfUser}/order-id/${idOfOrder}`, formData, {
        headers: {
          'Content-Type': `multipart/form-data`,
        },
      })
      .then(res => res)
      .catch(e => console.log(e));

    return dataReturn;
  }

  @authenticate('jwt')
  @authorize({
    voters: [basicAuthorization],
    allowedRoles: ['customer'],
  })
  @get('ordersKiot', {
    responses: {
      '200': {
        description: 'Return ordersKiot info',
        content: {
          'application/json': {
            schema: {
              type: 'Product in cart',
            },
          },
        },
      },
    },
  })
  async getAllOrderByUser(
    @inject(SecurityBindings.USER)
    currentUser: UserProfile,
    @param.query.object('filter') filter?: any,
  ): Promise<any> {
    const idOfUser = currentUser.id;
    let where: any;
    if (filter) {
      where = filter?.where || {};
      where = {...where, idOfUser};
      filter.where = where;
    }
    const data = await axios
      .get(`/ordersKiot`,{
        params: {
          filter
        }
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
  @get('ordersKiotShop', {
    responses: {
      '200': {
        description: 'Return order kiot info',
        content: {
          'application/json': {
            schema: {
              type: 'Product in cart',
            },
          },
        },
      },
    },
  })
  async getAllOrderByShop(
    @inject(SecurityBindings.USER)
    currentUser: UserProfile,
    @param.query.object('filter') filter?: string,
  ): Promise<any> {
    const idOfShop = currentUser.idOfShop;
    const data = await axios
      .get(`/ordersKiot/shop/${idOfShop}`, {
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
  @get('ordersKiotShop/count', {
    responses: {
      '200': {
        description: 'Return order kiot info',
        content: {
          'application/json': {
            schema: {
              type: 'Product in cart',
            },
          },
        },
      },
    },
  })
  async countOrderBySHop(
    @inject(SecurityBindings.USER)
    currentUser: UserProfile,
    @param.query.object('filter') filter?: string,
  ): Promise<any> {
    const idOfShop = currentUser.idOfShop;
    const data = await axios
      .get(`/ordersKiot/shop/${idOfShop}/count`, {
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
  @get('ordersKiotShop/{id}', {
    responses: {
      '200': {
        description: 'Return order kiot info',
        content: {
          'application/json': {
            schema: {
              type: 'Product in cart',
            },
          },
        },
      },
    },
  })
  async getOneByShop(@param.path.string('id') id: string): Promise<any> {
    const data = await axios
      .get(`/ordersKiot/${id}`)
      .then(res => res)
      .catch(e => console.log(e));

    return data;
  }

  @authenticate('jwt')
  @authorize({
    voters: [basicAuthorization],
    allowedRoles: ['admin'],
  })
  @get('ordersKiotAdmin', {
    responses: {
      '200': {
        description: 'Return order kiot info',
        content: {
          'application/json': {
            schema: {
              type: 'Product in cart',
            },
          },
        },
      },
    },
  })
  async getAllOrderByAdmin(
    @param.query.object('filter') filter?: string,
  ): Promise<any> {
    const data = await axios
      .get(`/ordersKiot`, {params: {filter}})
      .then(res => res.data)
      .catch(e => console.log(e));

    this.response.header('Access-Control-Expose-Headers', 'Content-Range');
    this.response.header('Content-Range', 'orderSKiotAdmin 0-20/20');
    this.response.status(200).send(data);
  }

  @authenticate('jwt')
  @authorize({
    voters: [basicAuthorization],
    allowedRoles: ['admin', 'order-Managment'],
  })
  @get('ordersKiotAdmin/count', {
    responses: {
      '200': {
        description: 'Return order kiot info',
        content: {
          'application/json': {
            schema: {
              type: 'Product in cart',
            },
          },
        },
      },
    },
  })
  async count(@param.query.object('filter') filter?: string): Promise<any> {
    const data = await axios
      .get(`/ordersKiot/count`, {params: {filter}})
      .then(res => res.data)
      .catch(e => console.log(e));

    return data;
  }

  @authenticate('jwt')
  @authorize({
    voters: [basicAuthorization],
    allowedRoles: ['admin', 'order-Managment'],
  })
  @get('ordersKiotAdmin/days/{numberOfDay}', {
    responses: {
      '200': {
        description: 'Return order kiot info',
        content: {
          'application/json': {
            schema: {
              type: 'Product in cart',
            },
          },
        },
      },
    },
  })
  async getDays(
    @param.path.number('numberOfDay') numberOfDay: number,
  ): Promise<any> {
    const data = await axios
      .get(`/ordersKiot/days/${numberOfDay}`)
      .then(res => res)
      .catch(e => console.log(e));

    this.response.header('Access-Control-Expose-Headers', 'Content-Range');
    this.response.header('Content-Range', 'OrdersAdmin 0-20/20');
    this.response.status(200).send(data);
  }

  @authenticate('jwt')
  @authorize({
    voters: [basicAuthorization],
    allowedRoles: ['employee'],
  })
  @get('ordersKiotShop/days/{numberOfDay}', {
    responses: {
      '200': {
        description: 'Return order kiot info',
        content: {
          'application/json': {
            schema: {
              type: 'Product in cart',
            },
          },
        },
      },
    },
  })
  async getShops(
    @inject(SecurityBindings.USER)
    currentUser: UserProfile,
    @param.path.number('numberOfDay') numberOfDay: number,
  ): Promise<any> {
    const idOfShop = currentUser.idOfShop;
    const data = await axios
      .get(`/ordersKiotShop/days/${numberOfDay}/shop/${idOfShop}`)
      .then(res => res)
      .catch(e => console.log(e));

    this.response.header('Access-Control-Expose-Headers', 'Content-Range');
    this.response.header('Content-Range', 'OrdersAdmin 0-20/20');
    this.response.status(200).send(data);
  }


  @authenticate('jwt')
  @authorize({
    voters: [basicAuthorization],
    allowedRoles: ['admin', 'order-Managment'],
  })
  @get('ordersKiotAdmin/{id}', {
    responses: {
      '200': {
        description: 'Return order kiot info',
        content: {
          'application/json': {
            schema: {
              type: 'Product in cart',
            },
          },
        },
      },
    },
  })
  async getOne(@param.path.string('id') id: string): Promise<any> {
    const data = await axios
      .get(`/ordersKiot/${id}`)
      .then(res => res)
      .catch(e => console.log(e));

    this.response.header('Access-Control-Expose-Headers', 'Content-Range');
    this.response.header('Content-Range', 'orderSKiotAdmin 0-20/20');
    this.response.status(200).send(data);
  }
}
