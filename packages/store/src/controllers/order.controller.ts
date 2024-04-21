import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
  RestBindings,
  Request,
  Response,
} from '@loopback/rest';
import {Order} from '../models';
import {
  BoughtProductRepository,
  OrderRepository,
  ProductRepository,
  ProductsInCartRepository,
  ProductsInOrderRepository,
  ReturnOrderRepository,
  WalletOfShopRepository,
  WalletRepository,
} from '../repositories';
import axios from 'axios';

import {inject} from '@loopback/core';
import {uploadFile, deleteRemoteFile} from '../config/firebaseConfig';
import multer from 'multer';
import {RabbitMQService} from '../services/rabbitMqServices';

const storage = multer.memoryStorage();
const upload = multer({storage});

var cpUpload = upload.fields([{name: 'images'}]);

// import cron from 'node-cron';

// Phu Tho 229
// Huyen Thanh Thuy 2237
// Xa Doan Ha 151204
// Huyen Yen Lap 2268
// Xa Xuan Thuy 150716
// service_id: 53320
// service_type_id: 2
// service_id: 100039
// service_type_id: 5

export class OrderController {
  constructor(
    @inject(RestBindings.Http.RESPONSE)
    private response: Response,
    @inject(RestBindings.Http.REQUEST)
    private request: Request,
    @repository(WalletOfShopRepository)
    public walletOfShopRepository: WalletOfShopRepository,
    @repository(OrderRepository)
    public orderRepository: OrderRepository,
    @repository(ProductsInCartRepository)
    public productsInCartRepository: ProductsInCartRepository,
    @repository(ProductRepository)
    public productRepository: ProductRepository,
    @repository(ProductsInOrderRepository)
    public productsInOrderRepository: ProductsInOrderRepository,
    @repository(WalletRepository)
    public walletRepository: WalletRepository,
    @repository(BoughtProductRepository)
    public boughtProductRepository: BoughtProductRepository,
    @repository(ReturnOrderRepository)
    public returnOrderRepository: ReturnOrderRepository,
  ) {}

  newRabbitMQService = RabbitMQService.getInstance();

  @post('/orders/orderInfor/{idOfUser}/order-id/{id}')
  @response(200, {description: 'Order model instance'})
  async orderInfor(
    @param.path.string('idOfUser') idOfUser: string,
    @param.path.string('id') id: string,
  ): Promise<any> {
    const order: any = await this.orderRepository.find({where: {id, idOfUser}});
    if (order.length == 1) {
      const clientOrderCode = order[0].clientOrderCode;
      const dataRaw = {
        client_order_code: clientOrderCode,
      };

      const response = await axios.post(
        'https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/detail-by-client-code',
        dataRaw,
        {
          headers: {
            'Content-Type': 'application/json',
            Token: '33108a16-e157-11ee-8bfa-8a2dda8ec551',
          },
        },
      );

      return response.data;
    }
  }

  @post('/orders/prepared/{idOfShop}/order-id/{id}')
  @response(200, {description: 'Order model instance'})
  async prepared(
    @param.path.string('idOfShop') idOfShop: string,
    @param.path.string('id') id: string,
  ): Promise<any> {
    const order: any = await this.orderRepository.find({where: {id, idOfShop}});
    const productsInOrder = await this.productsInOrderRepository.find({
      where: {idOfOrder: id},
    });

    const productsInOrderList = await Promise.all(
      productsInOrder.map(async (productInCart: any) => {
        const idProduct = productInCart.idOfProduct;
        const product: any = await this.productRepository.findById(idProduct);
        const {name, price, image, weight} = product;
        const dimensionList = product.dimension.split('|');
        const length = +dimensionList[0];
        const width = +dimensionList[1];
        const height = +dimensionList[2];
        return {
          name,
          price,
          quantity: +productInCart.quantity,
          weight: Math.round(weight),
          length,
          width,
          height,
        };
      }),
    );

    try {
      if (order.length == 1) {
        const orderData = order[0];
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
          serviceId,
          serviceTypeId,
          paymentTypeId,
          content,
          codAmount,
          note,
          requiredNote,
          weight,
          dimension,
          insuranceValue,
          clientOrderCode,
        } = orderData;
        const fromProvinceName = fromProvince.split('-')[0].trim();
        const fromDistrictName = fromDistrict.split('-')[0].trim();
        const fromWardName = fromWard.split('-')[0].trim();
        const toProvinceId = toProvince.split('-')[1].trim();
        const toDistrictId = toDistrict.split('-')[1].trim();
        const toWardCode = toWard.split('-')[1].trim();
        const length = +dimension.split('|')[0];
        const width = +dimension.split('|')[1];
        const height = +dimension.split('|')[2];

        const dataRaw = {
          payment_type_id: paymentTypeId,
          note,
          required_note: requiredNote,
          from_name: fromName,
          from_phone: fromPhone,
          from_address: fromAddress,
          from_province_name: fromProvinceName,
          from_district_name: fromDistrictName,
          from_ward_name: fromWardName,
          to_name: toName,
          to_phone: toPhone,
          to_address: toAddress,
          to_district_id: toDistrictId,
          to_ward_code: toWardCode,
          cod_amount: codAmount,
          content,
          weight,
          length,
          width,
          height,
          insurance_value: insuranceValue,
          service_id: serviceId,
          service_type_id: serviceTypeId,
          client_order_code: clientOrderCode,
          items: productsInOrderList,
        };

        const response = await axios.post(
          'https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/create',
          dataRaw,
          {
            headers: {
              'Content-Type': 'application/json',
              Token: '33108a16-e157-11ee-8bfa-8a2dda8ec551',
              ShopId: '191006',
            },
          },
        );

        await this.orderRepository.updateById(id, {
          totalFee: response.data.data.total_fee,
          status: 'prepared',
          updatedAt: new Date(),
        });

        return response.data;
      } else {
        return {
          message: 'Error not found order',
        };
      }
    } catch (error) {
      return {
        message: `error ${error}`,
      };
    }
  }

  @post('/orders/rejected/{idOfUser}/order-id/{id}')
  @response(200, {
    description: 'Order model instance',
    content: {'application/json': {schema: getModelSchemaRef(Order)}},
  })
  async rejected(
    @param.path.string('idOfUser') idOfUser: string,
    @param.path.string('id') id: string,
  ): Promise<any> {
    try {
      const order: any = await this.orderRepository.find({
        where: {id, idOfUser},
      });
      const idOfShop = order[0].idOfShop;
      if (order.length == 1) {
        await this.orderRepository.updateById(id, {
          status: 'rejected',
          updatedAt: new Date(),
        });

        if (order[0].paymentMethod == 'payOnline') {
          const oldWallet: any = await this.walletRepository.findOne({
            where: {idOfUser},
          });
          await this.walletRepository.updateAll(
            {amountMoney: oldWallet?.amountMoney + order[0].priceOfAll},
            {idOfUser},
          );

          const dataTransaction = JSON.stringify({
            idOfUser,
            amountOfMoney: order[0].priceOfAll,
            type: 'receive',
            createdAt: new Date().toISOString(),
            idOfOrder: id,
          });

          (await this.newRabbitMQService).sendMessageToTopicExchange(
            'transaction',
            'create',
            dataTransaction,
          );

          const dataNoti = JSON.stringify({
            idOfUser,
            content: `Đơn hàng ${id} đã bi huy va tien da duoc hoan lai vao tai khoan cua ban`,
            createdAt: new Date().toISOString(),
          });

          (await this.newRabbitMQService).sendMessageToTopicExchange(
            'notification',
            'create',
            dataNoti,
          );
        }

        const dataNoti = JSON.stringify({
          idOfUser,
          content: `Đơn hàng ${id} đã bi huy`,
          createdAt: new Date().toISOString(),
        });

        (await this.newRabbitMQService).sendMessageToTopicExchange(
          'notification',
          'create',
          dataNoti,
        );

        return {
          message: 'Success',
        };
      } else {
        return {
          message: 'Error not found order',
        };
      }
    } catch (error) {
      return {
        message: `error ${error}`,
      };
    }
  }

  @post('/orders/accepted/{idOfShop}/order-id/{id}')
  @response(200, {
    description: 'Order model instance',
    content: {'application/json': {schema: getModelSchemaRef(Order)}},
  })
  async accepted(
    @param.path.string('idOfShop') idOfShop: string,
    @param.path.string('id') id: string,
  ): Promise<any> {
    try {
      const order = await this.orderRepository.find({where: {id, idOfShop}});
      if (order.length == 1) {
        await this.orderRepository.updateById(id, {
          status: 'accepted',
          updatedAt: new Date(),
        });

        const dataNoti = JSON.stringify({
          idOfUser: order[0].idOfUser,
          content: `Đơn hàng ${id} đã duoc chap nhan`,
          createdAt: new Date().toISOString(),
        });

        (await this.newRabbitMQService).sendMessageToTopicExchange(
          'notification',
          'create',
          dataNoti,
        );

        return {
          message: 'Success',
        };
      } else {
        return {
          message: 'Error not found order',
        };
      }
    } catch (error) {
      return {
        message: `error ${error}`,
      };
    }
  }

  @post('/orders/received/{idOfUser}/order-id/{id}')
  @response(200, {
    description: 'Order model instance',
    content: {'application/json': {schema: getModelSchemaRef(Order)}},
  })
  async received(
    @param.path.string('idOfUser') idOfUser: string,
    @param.path.string('id') id: string,
  ): Promise<any> {

    try {
      const order: any = await this.orderRepository.findOne({
        where: {id, idOfUser},
      });
      if (order) {
        await this.orderRepository.updateById(id, {
          status: 'received',
          updatedAt: new Date(),
        });
        const oldWallet = await this.walletOfShopRepository.findOne({
          where: {idOfShop: order.idOfShop},
        });

        await this.walletOfShopRepository.updateAll(
          {
            amountMoney:
              oldWallet?.amountMoney + order.codAmount - order.totalFee,
          },
          {idOfShop: order.idOfShop},
        );

        const dataTransaction = JSON.stringify({
          idOfShop: order.idOfShop,
          amountOfMoney: order.codAmount - order.totalFee,
          type: 'receive',
          createdAt: new Date().toISOString(),
          idOfOrder: id,
        });

        (await this.newRabbitMQService).sendMessageToTopicExchange(
          'transactionForShop',
          'create',
          dataTransaction,
        );

        const dataNoti = JSON.stringify({
          idOfShop: order.idOfShop,
          content: `Đơn hàng ${id} đã được nhận ${order.codAmount - order.totalFee} đã được chuyển vào tài khoản của bạn`,
          createdAt: new Date().toISOString(),
        });

        (await this.newRabbitMQService).sendMessageToTopicExchange(
          'notificationForShop',
          'create',
          dataNoti,
        );

        const idOfBuyer = order.idOfUser;
        const listProductsInOrder = await this.productsInOrderRepository.find({
          where: {idOfOrder: id},
        });

        await Promise.all(
          listProductsInOrder.map(async (productInOrder: any) => {
            const idOfProduct = productInOrder.idOfProduct;
            const quantity = productInOrder.quantity;
            const idOfUser = idOfBuyer;
            const createAt = new Date();
            this.boughtProductRepository.create({
              idOfProduct,
              idOfOrder: id,
              idOfUser,
              createAt,
              quantity,
            });
          }),
        );

        return {
          message: 'Success',
        };
      } else {
        return {
          message: 'Error not found order',
        };
      }
    } catch (error) {
      return {
        message: `error ${error}`,
      };
    }
  }

  @post('/orders/returned/{idOfShop}/order-id/{id}')
  @response(200, {
    description: 'Order model instance',
    content: {'application/json': {schema: getModelSchemaRef(Order)}},
  })
  async returned(
    @param.path.string('idOfShop') idOfShop: string,
    @param.path.string('id') id: string,
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
    try {
      const order: any = await this.orderRepository.find({
        where: {id, idOfShop},
      });
      const idOfUser = order[0].idOfUser;
      if (order.length == 1) {
        await this.orderRepository.updateById(id, {
          status: 'returned',
          updatedAt: new Date(),
        });

        if (order[0].paymentMethod == 'payOnline') {
          const oldWallet: any = await this.walletRepository.findOne({
            where: {idOfUser},
          });
          await this.walletRepository.updateAll(
            {amountMoney: oldWallet?.amountMoney + order[0].priceOfAll},
            {idOfUser},
          );
        }

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

        const {reason} = data.body;
        const images = data.files.images;
        const imagesData = await Promise.all(
          images.map(async (image: any) => {
            const imageData: any = await uploadFile(image);
            return {
              filename: imageData.filename,
              url: imageData.url,
            };
          }),
        );

        this.returnOrderRepository.create({
          idOfOrder: id,
          idOfUser,
          idOfShop,
          reason,
          images: imagesData,
        });

        return {
          message: 'Success',
        };
      } else {
        return {
          message: 'Error not found order',
        };
      }
    } catch (error) {
      return {
        message: `error ${error}`,
      };
    }
  }

  @post('/orders/canceled/{idOfUser}/order-id/{id}')
  @response(200, {
    description: 'Order model instance',
    content: {'application/json': {schema: getModelSchemaRef(Order)}},
  })
  async canceled(
    @param.path.string('idOfUser') idOfUser: string,
    @param.path.string('id') id: string,
  ): Promise<any> {
    try {
      const order = await this.orderRepository.find({where: {id, idOfUser}});
      if (order.length == 1) {
        await this.orderRepository.updateById(id, {
          status: 'canceled',
          updatedAt: new Date(),
        });

        if (order[0].paymentMethod == 'payOnline') {
          const oldWallet: any = await this.walletRepository.findOne({
            where: {idOfUser},
          });
          await this.walletRepository.updateAll(
            {amountMoney: oldWallet?.amountMoney + order[0].priceOfAll},
            {idOfUser},
          );

          const dataTransaction = JSON.stringify({
            idOfUser,
            amountOfMoney: order[0].priceOfAll,
            type: 'refund',
            createdAt: new Date().toISOString(),
            idOfOrder: id,
          });

          (await this.newRabbitMQService).sendMessageToTopicExchange(
            'transaction',
            'create',
            dataTransaction,
          );

          const dataNoti = JSON.stringify({
            idOfUser,
            content: `Đơn hàng ${id} đã được hủy và tiền đã được hoàn lại vào tài khoản của bạn`,
            createdAt: new Date().toISOString(),
          });

          (await this.newRabbitMQService).sendMessageToTopicExchange(
            'notification',
            'create',
            dataNoti,
          );
        }

        const dataNoti = JSON.stringify({
          idOfShop: order[0].idOfShop,
          content: `Đơn hàng ${id} đã bi huy`,
          createdAt: new Date().toISOString(),
        });

        (await this.newRabbitMQService).sendMessageToTopicExchange(
          'notificationForShop',
          'create',
          dataNoti,
        );

        return {
          message: 'Success',
        };
      } else {
        return {
          message: 'Error not found order',
        };
      }
    } catch (error) {
      return {
        message: `error ${error}`,
      };
    }
  }

  @post('/orders/create/{idOfUser}/shop/{idOfShop}')
  @response(200, {
    description: 'Order model instance',
    content: {'application/json': {schema: getModelSchemaRef(Order)}},
  })
  async create(
    @param.path.string('idOfUser') idOfUser: string,
    @param.path.string('idOfShop') idOfShop: string,
    @requestBody({
      content: {
        'application/json': {},
      },
    })
    order: any,
  ): Promise<any> {
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
      serviceId,
      serviceTypeId,
      content,
      priceOfAll,
      paymentMethod,
      note,
      requiredNote,
      items,
    } = order;

    let weightBox = 0;
    let lengthBox = 0;
    let widthBox = 0;
    let heightBox = 0;
    let insuranceValue = 0;
    let imageOrder = {};

    await Promise.all(
      items.map(async (item: any, index: number) => {
        const idProduct = item.idOfProduct;
        const product: any = await this.productRepository.findById(idProduct);
        const {name, price, image, dimension, weight} = product;
        if (index == 0) {
          imageOrder = image;
        }
        const dimensionList = dimension.split('|');
        weightBox += weight * item.quantity;
        const length = +dimensionList[0];
        const width = +dimensionList[1];
        const height = +dimensionList[2];

        insuranceValue += price * item.quantity;

        if (length > lengthBox) {
          lengthBox = length;
        }

        if (width > widthBox) {
          widthBox = width;
        }

        heightBox += height * item.quantity;

        return {
          name,
          price,
          image,
          quantity: item.quantity,
          weight,
          length,
          width,
          height,
        };
      }),
    );

    lengthBox = Math.round(lengthBox);
    widthBox = Math.round(widthBox);
    heightBox = Math.round(heightBox);

    const dimension = `${lengthBox}|${widthBox}|${heightBox}`;
    const clientOrderCode =
      'GHN' +
      Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, '0');

    const NewOrder: any = {
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
      serviceId,
      serviceTypeId,
      paymentTypeId: 2,
      content,
      codAmount: paymentMethod == 'cod' ? priceOfAll : 0,
      note,
      requiredNote,
      idOfShop,
      idOfUser,
      weight: Math.round(weightBox),
      dimension,
      insuranceValue,
      clientOrderCode,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
      priceOfAll,
      paymentMethod,
      image: imageOrder,
    };

    const dataOrder = await this.orderRepository.create(NewOrder);
    const oldWallet: any = await this.walletRepository.findOne({
      where: {idOfUser},
    });

    if (paymentMethod == 'payOnline') {
      if (oldWallet?.amountMoney < priceOfAll) {
        return this.response.status(400).send({
          message: 'Not enough money in wallet',
        });
      } else {
        await this.walletRepository.updateAll(
          {amountMoney: oldWallet?.amountMoney - priceOfAll},
          {idOfUser},
        );
      }
    }

    const idOrder = dataOrder.id;
    await Promise.all(
      await items.map(async (item: any) => {
        const idProduct = item.idOfProduct;
        await this.productsInOrderRepository.create({
          idOfOrder: idOrder,
          idOfProduct: idProduct,
          quantity: item.quantity,
        });
      }),
    );

    const dataNoti = JSON.stringify({
      idOfShop,
      content: `Đơn hàng ${idOrder} đã được tạo thành công voi gia tien ${priceOfAll}`,
      image: imageOrder,
      createdAt: new Date().toISOString(),
    });

    (await this.newRabbitMQService).sendMessageToTopicExchange(
      'notificationForShop',
      'create',
      dataNoti,
    );

    if (paymentMethod == 'payOnline') {
      const dataTransaction = JSON.stringify({
        idOfUser,
        amountOfMoney: priceOfAll,
        type: 'send',
        createdAt: new Date().toISOString(),
        image: imageOrder,
        idOfOrder: idOrder,
      });

      (await this.newRabbitMQService).sendMessageToTopicExchange(
        'transaction',
        'create',
        dataTransaction,
      );
    }
    return dataOrder;
  }

  @post('/orders/service')
  @response(200, {
    description: 'get service from - to district',
    content: {'application/json': {schema: {}}},
  })
  async getService(
    @requestBody({
      content: {
        'application/json': {},
      },
    })
    req: any,
  ): Promise<any> {
    const {fromDistrict, toDistrict} = req;
    const dataRaw = {
      from_district: +fromDistrict,
      to_district: +toDistrict,
      shop_id: 191006,
    };

    try {
      const response = await axios.post(
        'https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/available-services',
        dataRaw,
        {
          headers: {
            'Content-Type': 'application/json',
            Token: '33108a16-e157-11ee-8bfa-8a2dda8ec551',
          },
        },
      );
      if (response.status == 200) {
        const data = response.data.data;
        return data;
      } else {
        return {
          message: 'Error when get data from GHN',
        };
      }
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  }

  //get All for admin
  @get('/orders')
  @response(200, {
    description: 'Array of Order model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Order, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(Order) filter?: Filter<Order>): Promise<Order[]> {
    return this.orderRepository.find(filter);
  }

  //get All for user
  @get('/orders/{idOfUser}')
  @response(200, {
    description: 'Array of Order model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Order, {includeRelations: true}),
        },
      },
    },
  })
  async findByUser(
    @param.path.string('idOfUser') idOfUser: string,
  ): Promise<Order[]> {
    return this.orderRepository.find({where: {idOfUser}});
  }

  @get('/orders/{id}')
  @response(200, {
    description: 'Order model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Order, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Order, {exclude: 'where'})
    filter?: FilterExcludingWhere<Order>,
  ): Promise<Order> {
    return this.orderRepository.findById(id, filter);
  }

  @patch('/orders/{id}')
  @response(204, {
    description: 'Order PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Order, {partial: true}),
        },
      },
    })
    order: Order,
  ): Promise<void> {
    await this.orderRepository.updateById(id, order);
  }
}
