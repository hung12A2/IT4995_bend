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

export class OrderController {
  constructor(
    @inject(RestBindings.Http.RESPONSE) public response: Response,
    @inject(RestBindings.Http.REQUEST) public request: Request,
  ) {}

  @authenticate('jwt')
  @authorize({
    voters: [basicAuthorization],
    allowedRoles: ['customer'],
  })
  @post('orders/preview', {
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
  async preview(
    @requestBody({
      description: 'add products to cart',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
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
    const {fromDistrict, toDistrict, fromWard, toWard, items} = request;
    const data = axios
      .post('/orders/preview', {
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
  //

  @authenticate('jwt')
  @authorize({
    voters: [basicAuthorization],
    allowedRoles: ['customer'],
  })
  @post('orders/create/shop/{idOfShop}', {
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
  async create(
    @inject(SecurityBindings.USER)
    currentUser: UserProfile,
    @param.path.string('idOfShop') idOfShop: string,
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
      totalFee,

    } = request;
    const data = axios
      .post(
        `/orders/create/${idOfUser}/shop/${idOfShop}`,
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

  @authenticate('jwt')
  @authorize({
    voters: [basicAuthorization],
    allowedRoles: ['employee', 'order-Managment'],
  })
  @post('orders/accepted/order/{idOfOrder}', {
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
              requiredNote: {type: 'string'},
            },
          },
        },
      },
    })
    request: any,
  ): Promise<any> {
    const idOfShop = currentUser.idOfShop;
    const content = request?.content;
    const requiredNote = request?.requiredNote;
    const data = await axios
      .post(`/orders/accepted/${idOfShop}/order-id/${idOfOrder}`, {
        content,
        requiredNote,
      })
      .then(res => res)
      .catch(e => console.log(e));

    return data;
  }

  @authenticate('jwt')
  @authorize({
    voters: [basicAuthorization],
    allowedRoles: ['employee', 'order-Managment'],
  })
  @post('orders/inTransist/order/{idOfOrder}', {
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
  async inTransist(
    @inject(SecurityBindings.USER)
    currentUser: UserProfile,
    @param.path.string('idOfOrder') idOfOrder: string,
  ): Promise<any> {
    const idOfShop = currentUser.idOfShop;

    const data = await axios
      .post(`/orders/inTransist/${idOfShop}/order-id/${idOfOrder}`)
      .then(res => res)
      .catch(e => console.log(e));

    return data;
  }

  @authenticate('jwt')
  @authorize({
    voters: [basicAuthorization],
    allowedRoles: ['employee', 'order-Managment'],
  })
  @post('orders/inTransist2/order/{idOfOrder}', {
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
  async inTransist2(
    @inject(SecurityBindings.USER)
    currentUser: UserProfile,
    @param.path.string('idOfOrder') idOfOrder: string,
  ): Promise<any> {
    const idOfShop = currentUser.idOfShop;

    const data = await axios
      .post(`/orders/inTransist2/${idOfShop}/order-id/${idOfOrder}`)
      .then(res => res)
      .catch(e => console.log(e));

    return data;
  }

  @authenticate('jwt')
  @authorize({
    voters: [basicAuthorization],
    allowedRoles: ['employee', 'order-Managment'],
  })
  @post('orders/delivered/order/{idOfOrder}', {
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
  async delivered(
    @inject(SecurityBindings.USER)
    currentUser: UserProfile,
    @param.path.string('idOfOrder') idOfOrder: string,
  ): Promise<any> {
    const idOfShop = currentUser.idOfShop;

    const data = await axios
      .post(`/orders/delivered/${idOfShop}/order-id/${idOfOrder}`)
      .then(res => res)
      .catch(e => console.log(e));

    return data;
  }

  @authenticate('jwt')
  @authorize({
    voters: [basicAuthorization],
    allowedRoles: ['employee', 'order-Managment'],
  })
  @post('orders/prepared/order/{idOfOrder}', {
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
      .post(`/orders/prepared/${idOfShop}/order-id/${idOfOrder}`)
      .then(res => res)
      .catch(e => console.log(e));

    return data;
  }

  @authenticate('jwt')
  @authorize({
    voters: [basicAuthorization],
    allowedRoles: ['employee', 'order-Managment'],
  })
  @post('orders/rejected/order/{idOfOrder}', {
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
      .post(`/orders/rejected/${idOfShop}/order-id/${idOfOrder}`)
      .then(res => res)
      .catch(e => console.log(e));

    return data;
  }

  @authenticate('jwt')
  @authorize({
    voters: [basicAuthorization],
    allowedRoles: ['customer'],
  })
  @post('orders/received/order/{idOfOrder}', {
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
  async received(
    @inject(SecurityBindings.USER)
    currentUser: UserProfile,
    @param.path.string('idOfOrder') idOfOrder: string,
  ): Promise<any> {
    const idOfUser = currentUser.id;
    const data = await axios
      .post(`/orders/received/${idOfUser}/order-id/${idOfOrder}`)
      .then(res => res)
      .catch(e => console.log(e));

    return data;
  }

  @authenticate('jwt')
  @authorize({
    voters: [basicAuthorization],
    allowedRoles: ['customer'],
  })
  @post('orders/returned/order/{idOfOrder}', {
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
  async returned(
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
      .post(`/orders/returned/${idOfUser}/order-id/${idOfOrder}`, formData, {
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
    allowedRoles: ['employee', 'order-Managment'],
  })
  @post('orders/orderInfo/order/{idOfOrder}', {
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
  async orderInfo(
    @inject(SecurityBindings.USER)
    currentUser: UserProfile,
    @param.path.string('idOfOrder') idOfOrder: string,
  ): Promise<any> {
    const data = await axios
      .post(`/orders/orderInfor/order-id/${idOfOrder}`)
      .then(res => res)
      .catch(e => console.log(e));

    return data;
  }

  @authenticate('jwt')
  @authorize({
    voters: [basicAuthorization],
    allowedRoles: ['customer'],
  })
  @get('orders', {
    responses: {
      '200': {
        description: 'Return orders info',
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
      .get(`/orders`, {
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
  @get('ordersShop', {
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
      .get(`/ordersShop/${idOfShop}`, {
        params: {filter},
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
  @get('ordersShop/count', {
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
  async countAllOrderByShop(
    @inject(SecurityBindings.USER)
    currentUser: UserProfile,
    @param.query.object('filter') filter?: string,
  ): Promise<any> {
    const idOfShop = currentUser.idOfShop;
    const data = await axios
      .get(`/ordersShop/${idOfShop}/count`, {
        params: {filter},
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
  @get('ordersShop/{id}', {
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
      .get(`/orders/${id}`)
      .then(res => res)
      .catch(e => console.log(e));

    return data;
  }

  @authenticate('jwt')
  @authorize({
    voters: [basicAuthorization],
    allowedRoles: ['admin', 'order-Managment'],
  })
  @get('ordersAdmin', {
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
      .get(`/orders`, {params: {filter}})
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
  @get('ordersAdmin/days/{numberOfDay}', {
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
      .get(`/orders/days/${numberOfDay}`)
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
  @get('ordersShop/days/{numberOfDay}', {
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
  async getDaysShop(
    @inject(SecurityBindings.USER)
    currentUser: UserProfile,
    @param.path.number('numberOfDay') numberOfDay: number,
  ): Promise<any> {
    const idOfShop = currentUser.idOfShop;
    const data = await axios
      .get(`/orders/days/${numberOfDay}/shop/${idOfShop}`)
      .then(res => res)
      .catch(e => console.log(e));

    return data;
  }

  @authenticate('jwt')
  @authorize({
    voters: [basicAuthorization],
    allowedRoles: ['admin', 'order-Managment'],
  })
  @get('ordersAdmin/{id}', {
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
      .get(`/orders/${id}`)
      .then(res => res)
      .catch(e => console.log(e));

    return data;
  }

  @authenticate('jwt')
  @authorize({
    voters: [basicAuthorization],
    allowedRoles: ['admin', 'order-Managment'],
  })
  @get('ordersAdmin/count', {
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
      .get(`/orders/count`, {params: {filter}})
      .then(res => res)
      .catch(e => console.log(e));

    this.response.header('Access-Control-Expose-Headers', 'Content-Range');
    this.response.header('Content-Range', 'OrdersAdmin 0-20/20');
    this.response.status(200).send(data);
  }
}
