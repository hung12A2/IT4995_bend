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
  parseJson,
} from '@loopback/rest';
import {Order} from '../models';
import {
  BoughtProductRepository,
  OrderKiotRepository,
  OrderRepository,
  ProductRepository,
  ProductsInCartRepository,
  ProductsInOrderKiotRepository,
  ProductsInOrderRepository,
  ReturnOrderRepository,
  ShopInfoRepository,
  WalletOfShopRepository,
  WalletRepository,
} from '../repositories';
import axios from 'axios';

import {inject} from '@loopback/core';
import {uploadFile, deleteRemoteFile} from '../config/firebaseConfig';
import multer from 'multer';
import {RabbitMQService} from '../services/rabbitMqServices';
import {geometry, getDistance} from '../utils/getGeometry';

const storage = multer.memoryStorage();
const upload = multer({storage});

var cpUpload = upload.fields([{name: 'images'}]);

// import cron from 'node-cron';
//
// Phu Tho 229
// Huyen Thanh Thuy 2237
// Xa Doan Ha 151204
// Huyen Yen Lap 2268
// Xa Xuan Thuy 150716
// service_id: 53320
// service_type_id: 2
// service_id: 100039
// service_type_id: 5

export class OrderKiotController {
  constructor(
    @inject(RestBindings.Http.RESPONSE)
    private response: Response,
    @inject(RestBindings.Http.REQUEST)
    private request: Request,
    @repository(ShopInfoRepository)
    public shopInfoRepository: ShopInfoRepository,
    @repository(OrderKiotRepository)
    public orderKiotRepository: OrderKiotRepository,
    @repository(OrderRepository)
    public orderRepository: OrderRepository,
    @repository(ProductsInCartRepository)
    public productsInCartRepository: ProductsInCartRepository,
    @repository(ProductRepository)
    public productRepository: ProductRepository,
    @repository(ProductsInOrderKiotRepository)
    public productsInOrderKiotRepository: ProductsInOrderKiotRepository,
    @repository(WalletRepository)
    public walletRepository: WalletRepository,
    @repository(BoughtProductRepository)
    public boughtProductRepository: BoughtProductRepository,
    @repository(ReturnOrderRepository)
    public returnOrderRepository: ReturnOrderRepository,
    @repository(WalletOfShopRepository)
    public walletOfShopRepository: WalletOfShopRepository,
  ) {}

  newRabbitMQService = RabbitMQService.getInstance();

  @post('/ordersKiot/orderInfor/{idOfUser}/order-id/{id}')
  @response(200, {description: 'Order model instance'})
  async orderInfor(
    @param.path.string('idOfUser') idOfUser: string,
    @param.path.string('id') id: string,
  ): Promise<any> {
    const order: any = await this.orderKiotRepository.find({
      where: {id, idOfUser},
    });
    return order;
  }

  @post('/ordersKiot/deliverd/{idOfShop}/order-id/{id}')
  @response(200, {
    description: 'Order model instance',
    content: {'application/json': {schema: getModelSchemaRef(Order)}},
  })
  async deliverd(
    @param.path.string('idOfShop') idOfShop: string,
    @param.path.string('id') id: string,
  ): Promise<any> {
    try {
      const order: any = await this.orderKiotRepository.find({
        where: {id, idOfShop},
      });
      if (order.length == 1) {
        await this.orderKiotRepository.updateById(id, {
          status: 'deliverd',
          updatedAt: new Date().toLocaleString(),
        });

        const dataNoti = JSON.stringify({
          idOfUser: order[0].idOfUser,
          content: `Don hang ${id} da den noi`,
          image: order[0].image,
          createdAt: new Date().toLocaleString(),
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

  @post('/ordersKiot/inTransit/{idOfShop}/order-id/{id}')
  @response(200, {
    description: 'Order model instance',
    content: {'application/json': {schema: getModelSchemaRef(Order)}},
  })
  async inTransit(
    @param.path.string('idOfShop') idOfShop: string,
    @param.path.string('id') id: string,
  ): Promise<any> {
    try {
      const order: any = await this.orderKiotRepository.find({
        where: {id, idOfShop},
      });
      if (order.length == 1) {
        await this.orderKiotRepository.updateById(id, {
          status: 'inTransit',
          updatedAt: new Date().toLocaleString(),
        });

        const dataNoti = JSON.stringify({
          idOfUser: order[0].idOfUser,
          content: `Don hang ${id} dang tren duong van chuyen`,
          image: order[0].image,
          createdAt: new Date().toLocaleString(),
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

  @post('/ordersKiot/prepared/{idOfShop}/order-id/{id}')
  @response(200, {
    description: 'Order model instance',
    content: {'application/json': {schema: getModelSchemaRef(Order)}},
  })
  async prepared(
    @param.path.string('idOfShop') idOfShop: string,
    @param.path.string('id') id: string,
  ): Promise<any> {
    try {
      const order: any = await this.orderKiotRepository.find({
        where: {id, idOfShop},
      });
      if (order.length == 1) {
        await this.orderKiotRepository.updateById(id, {
          status: 'prepared',
          updatedAt: new Date().toLocaleString(),
        });

        const dataNoti = JSON.stringify({
          idOfUser: order[0].idOfUser,
          content: `Don hang ${id} da duoc chuan bi`,
          image: order[0].image,
          createdAt: new Date().toLocaleString(),
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

  @post('/ordersKiot/rejected/{idOfShop}/order-id/{id}')
  @response(200, {
    description: 'Order model instance',
    content: {'application/json': {schema: getModelSchemaRef(Order)}},
  })
  async rejected(
    @param.path.string('idOfShop') idOfShop: string,
    @param.path.string('id') id: string,
  ): Promise<any> {
    try {
      const order: any = await this.orderKiotRepository.find({
        where: {id, idOfShop},
      });
      const idOfUser = order[0].idOfUser;
      if (order.length == 1) {
        if (order[0].status == 'accepted') {
          const updatedAt = new Date(order[0].updatedAt).getTime();
          const newAt = new Date().getTime();
          if (newAt - updatedAt > 6000000) {
            return {code: 400, message: 'Khong the huy don hang sau 10 phut'};
          } else {
            const idOfOrder = order[0].id;
            const productInOrders =
              await this.productsInOrderKiotRepository.find({
                where: {idOfOrder},
              });

            await Promise.all(
              productInOrders.map(async productInOrder => {
                const product = await this.productRepository.findById(
                  productInOrder.idOfProduct,
                );
                await this.productRepository.updateById(
                  productInOrder.idOfProduct,
                  {
                    countInStock:
                      product.countInStock + productInOrder.quantity,
                  },
                );
              }),
            );
          }
        }

        await this.orderKiotRepository.updateById(id, {
          status: 'rejected',
          updatedAt: new Date().toLocaleString(),
        });

        if (order[0].paymentMethod == 'payOnline') {
          const oldWallet: any = await this.walletRepository.findOne({
            where: {idOfUser},
          });
          await this.walletRepository.updateAll(
            {amountMoney: oldWallet?.amountMoney + order[0].priceOfAll},
            {idOfUser},
          );

          const dataNoti = JSON.stringify({
            idOfUser,
            content: `Don hang ${id} da bi huy, nhan lai ${order[0].priceOfAll}`,
            image: order[0].image,
            createdAt: new Date().toLocaleString(),
          });

          (await this.newRabbitMQService).sendMessageToTopicExchange(
            'notification',
            'create',
            dataNoti,
          );

          const dataTransaction = JSON.stringify({
            idOfUser,
            amountMoney: order[0].priceOfAll,
            type: 'receive',
            createdAt: new Date().toLocaleString(),
            image: order[0].image,
            idOfOrder: order[0].id,
          });

          (await this.newRabbitMQService).sendMessageToTopicExchange(
            'transaction',
            'create',
            dataTransaction,
          );
        }

        const dataNoti = JSON.stringify({
          idOfUser,
          content: `Don hang ${id} da bi huy, nhan lai ${order[0].priceOfAll}`,
          image: order[0].image,
          createdAt: new Date().toLocaleString(),
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

  @post('/ordersKiot/accepted/{idOfShop}/order-id/{id}')
  @response(200, {
    description: 'Order model instance',
    content: {'application/json': {schema: getModelSchemaRef(Order)}},
  })
  async accepted(
    @param.path.string('idOfShop') idOfShop: string,
    @param.path.string('id') id: string,
  ): Promise<any> {
    try {
      const order = await this.orderKiotRepository.find({
        where: {id, idOfShop},
      });
      const idOfOrder = order[0].id;

      const productInOrders = await this.productsInOrderKiotRepository.find({
        where: {idOfOrder},
      });

      if (order[0].status !== 'pending') {
        return {
          code: 400,
          message: 'Error order processed',
        };
      }

      if (order.length == 1) {
        await Promise.all(
          productInOrders.map(async productInOrder => {
            const product = await this.productRepository.findById(
              productInOrder.idOfProduct,
            );
            if (product.countInStock < productInOrder.quantity) {
              return {
                code: 400,
                message: 'Error not enough product',
              };
            } else {
              await this.productRepository.updateById(
                productInOrder.idOfProduct,
                {countInStock: product.countInStock - productInOrder.quantity},
              );
            }
          }),
        );

        await this.orderKiotRepository.updateById(id, {
          status: 'accepted',
          updatedAt: new Date().toLocaleString(),
        });

        const dataNoti = JSON.stringify({
          idOfUser: order[0].idOfUser,
          content: `Don hang ${id} da duoc chap nhan`,
          image: order[0].image,
          createdAt: new Date().toLocaleString(),
        });

        (await this.newRabbitMQService).sendMessageToTopicExchange(
          'notification',
          'create',
          dataNoti,
        );

        return {
          code: 400,
          message: 'Success',
        };
      } else {
        return {
          code: 400,
          message: 'Error not found order',
        };
      }
    } catch (error) {
      return {
        code: 400,
        message: `error ${error}`,
      };
    }
  }

  @post('/ordersKiot/received/{idOfUser}/order-id/{id}')
  @response(200, {
    description: 'Order model instance',
    content: {'application/json': {schema: getModelSchemaRef(Order)}},
  })
  async received(
    @param.path.string('idOfUser') idOfUser: string,
    @param.path.string('id') id: string,
  ): Promise<any> {
    try {
      const order: any = await this.orderKiotRepository.findOne({
        where: {id, idOfUser},
      });
      if (order) {
        await this.orderKiotRepository.updateById(id, {
          status: 'received',
          updatedAt: new Date().toLocaleString(),
        });
        const oldWallet = await this.walletOfShopRepository.findOne({
          where: {idOfShop: order.idOfShop},
        });

        await this.walletOfShopRepository.updateAll(
          {
            amountMoney:
              oldWallet?.amountMoney + order.priceOfAll - order.totalFee,
          },
          {idOfShop: order.idOfShop},
        );

        const dataNoti = JSON.stringify({
          idOfShop: order.idOfShop,
          content: `Don hang ${id} da duoc nhan, nhan duoc ${order.priceOfAll - order.totalFee}`,
          image: order.image,
          createdAt: new Date().toLocaleString(),
        });

        (await this.newRabbitMQService).sendMessageToTopicExchange(
          'notificationForShop',
          'create',
          dataNoti,
        );

        const dataTransaction = JSON.stringify({
          idOfShop: order.idOfShop,
          amountMoney: order.priceOfAll - order.totalFee,
          type: 'receive',
          createdAt: new Date().toLocaleString(),
          image: order.image,
          idOfOrder: order.id,
        });

        (await this.newRabbitMQService).sendMessageToTopicExchange(
          'transactionForShop',
          'create',
          dataTransaction,
        );

        const idOfBuyer = order.idOfUser;
        const listProductsInOrder =
          await this.productsInOrderKiotRepository.find({
            where: {idOfOrder: id},
          });

        await Promise.all(
          listProductsInOrder.map(async (productInOrder: any) => {
            const idOfProduct = productInOrder.idOfProduct;
            const quantity = productInOrder.quantity;
            const idOfUser = idOfBuyer;
            const createAt = new Date().toLocaleString();
            await this.boughtProductRepository.create({
              idOfProduct,
              idOfOrder: id,
              idOfUser,
              createAt,
              quantity,
              isKiot: true,
            });

            const oldShopInfo: any = await this.shopInfoRepository.findOne({
              where: {idOfShop: order.idOfShop},
            });

            await this.shopInfoRepository.updateAll(
              {numberOfSold: oldShopInfo.numberOfSold + quantity},
              {idOfShop: order.idOfShop},
            );

            const oldProduct: any = await this.productRepository.findOne({
              where: {id: idOfProduct},
            });

            await this.productRepository.updateById(idOfProduct, {
              numberOfSold: oldProduct.numberOfSold + 1,
            });
          }),
        );

        return {
          code: 200,
          message: 'Success',
        };
      } else {
        return {
          code: 400,
          message: 'Error not found order',
        };
      }
    } catch (error) {
      return {
        code: 400,
        message: `error ${error}`,
      };
    }
  }

  @post('/ordersKiot/returned/{idOfUser}/order-id/{id}')
  @response(200, {
    description: 'Order model instance',
    content: {'application/json': {schema: getModelSchemaRef(Order)}},
  })
  async returned(
    @param.path.string('idOfUser') idOfUser: string,
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
      const order: any = await this.orderKiotRepository.find({
        where: {id, idOfUser},
      });
      const idOfShop = order[0].idOfShop;
      if (order.length == 1) {
        await this.orderKiotRepository.updateById(id, {
          status: 'returned',
          updatedAt: new Date().toLocaleString(),
        });

        if (order[0].paymentMethod == 'payOnline') {
          const oldWallet: any = await this.walletRepository.findOne({
            where: {idOfUser},
          });
          await this.walletRepository.updateAll(
            {amountMoney: oldWallet?.amountMoney + order[0].priceOfAll},
            {idOfUser},
          );

          const dataNoti = JSON.stringify({
            idOfUser,
            content: `Don hang ${id} da bi hoan tra, nhan lai ${order[0].priceOfAll}`,
            image: order[0].image,
            createdAt: new Date().toLocaleString(),
          });

          (await this.newRabbitMQService).sendMessageToTopicExchange(
            'notification',
            'create',
            dataNoti,
          );

          console.log(order[0].id);

          const dataTransaction = JSON.stringify({
            idOfUser,
            amountMoney: order[0].priceOfAll,
            type: 'receive',
            createdAt: new Date().toLocaleString(),
            image: order[0].image,
            idOfOrder: order[0].id,
          });

          (await this.newRabbitMQService).sendMessageToTopicExchange(
            'transaction',
            'create',
            dataTransaction,
          );
        }
        const dataNoti = JSON.stringify({
          idOfShop,
          content: `Don hang ${id} da bi hoan tra`,
          image: order[0].image,
          createdAt: new Date().toLocaleString(),
        });

        (await this.newRabbitMQService).sendMessageToTopicExchange(
          'notificationForShop',
          'create',
          dataNoti,
        );

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

        await this.returnOrderRepository.create({
          idOfOrder: id,
          idOfUser,
          idOfShop,
          reason,
          images: imagesData,
          isKiot: true,
        });

        return {
          code: 200,
          message: 'Success',
        };
      } else {
        return {
          code: 400,
          message: 'Error not found order',
        };
      }
    } catch (error) {
      return {
        code: 400,
        message: `error ${error}`,
      };
    }
  }

  @post('/ordersKiot/canceled/{idOfUser}/order-id/{id}')
  @response(200, {
    description: 'Order model instance',
    content: {'application/json': {schema: getModelSchemaRef(Order)}},
  })
  async canceled(
    @param.path.string('idOfUser') idOfUser: string,
    @param.path.string('id') id: string,
  ): Promise<any> {
    try {
      const order = await this.orderKiotRepository.find({
        where: {id, idOfUser},
      });
      if (order.length == 1) {
        await this.orderKiotRepository.updateById(id, {
          status: 'canceled',
          updatedAt: new Date().toLocaleString(),
        });

        if (order[0].paymentMethod == 'payOnline') {
          const oldWallet: any = await this.walletRepository.findOne({
            where: {idOfUser},
          });
          await this.walletRepository.updateAll(
            {amountMoney: oldWallet?.amountMoney + order[0].priceOfAll},
            {idOfUser},
          );

          const dataNoti = JSON.stringify({
            idOfUser: order[0].idOfUser,
            content: `Don hang hoa toc ${id} da bi huy, nhan lai ${order[0].priceOfAll}`,
            image: order[0].image,
            createdAt: new Date().toLocaleString(),
          });

          (await this.newRabbitMQService).sendMessageToTopicExchange(
            'notification',
            'create',
            dataNoti,
          );

          const dataTransaction = JSON.stringify({
            idOfUser,
            amountMoney: order[0].priceOfAll,
            type: 'receive',
            createdAt: new Date().toLocaleString(),
            image: order[0].image,
            idOfOrder: order[0].id,
          });

          (await this.newRabbitMQService).sendMessageToTopicExchange(
            'transaction',
            'create',
            dataTransaction,
          );
        }

        const dataNoti = JSON.stringify({
          idOfShop: order[0].idOfShop,
          content: `Don hang hoa toc ${id} da bi huy`,
          image: order[0].image,
          createdAt: new Date().toLocaleString(),
        });

        (await this.newRabbitMQService).sendMessageToTopicExchange(
          'notificationForShop',
          'create',
          dataNoti,
        );

        return {
          code: 200,
          message: 'Success',
        };
      } else {
        return {
          code: 400,
          message: 'Error not found order',
        };
      }
    } catch (error) {
      return {
        code: 200,
        message: `error ${error}`,
      };
    }
  }

  @post('/ordersOfKiot/create/{idOfUser}/shop/{idOfShop}/kiot/{idOfKiot}')
  @response(200, {
    description: 'Order model instance',
    content: {'application/json': {schema: getModelSchemaRef(Order)}},
  })
  async create(
    @param.path.string('idOfKiot') idOfKiot: string,
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
      content,
      priceOfAll,
      paymentMethod,
      note,
      requiredNote,
      items,
      distance,
      totalFee,
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

    const time = new Date().toLocaleString();

    const NewOrder: any = {
      distance,
      totalFee,
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
      codAmount: paymentMethod == 'cod' ? priceOfAll : 0,
      note,
      requiredNote,
      idOfKiot,
      idOfShop,
      idOfUser,
      weight: Math.round(weightBox),
      dimension,
      insuranceValue,
      status: 'pending',
      createdAt: time,
      updatedAt: time,
      createdBy: `user-${idOfUser}`,
      updatedBy: `user-${idOfUser}`,
      priceOfAll,
      paymentMethod,
      image: imageOrder,
    };

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
    const dataOrder = await this.orderKiotRepository.create(NewOrder);

    const idOrder = dataOrder.id;
    await Promise.all(
      await items.map(async (item: any) => {
        const idProduct = item.idOfProduct;
        await this.productsInOrderKiotRepository.create({
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
      createdAt: new Date().toLocaleString(),
    });

    (await this.newRabbitMQService).sendMessageToTopicExchange(
      'notificationForShop',
      'create',
      dataNoti,
    );

    if (paymentMethod == 'payOnline') {
      const dataTransaction = JSON.stringify({
        idOfUser,
        amountMoney: priceOfAll,
        type: 'send',
        createdAt: new Date().toLocaleString(),
        image: imageOrder,
        idOfOrder: idOrder,
      });

      (await this.newRabbitMQService).sendMessageToTopicExchange(
        'transaction',
        'create',
        dataTransaction,
      );
    }

    return {
      code: 200,
      data: dataOrder,
    };
  }

  @post('/ordersOfKiot/preview')
  @response(200, {
    description: 'Order model instance',
    content: {'application/json': {schema: getModelSchemaRef(Order)}},
  })
  async previewOrder(
    @requestBody({
      content: {
        'application/json': {},
      },
    })
    order: any,
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
    } = order;

    let distance = 0;
    let totalFee = 10000;
    let weightBox = 0;
    let lengthBox = 0;
    let widthBox = 0;
    let heightBox = 0;
    let insuranceValue = 0;

    await Promise.all(
      items.map(async (item: any, index: number) => {
        const idProduct = item.idOfProduct;
        const product: any = await this.productRepository.findById(idProduct);
        const {name, price, image, dimension, weight} = product;
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

    const fromGeometryData = await geometry(
      `${fromAddress}, ${fromWard}, ${fromDistrict}, ${fromProvince}`,
    );
    const formGeometry = fromGeometryData.results[0].geometry.location;
    const toGeometryData = await geometry(
      `${toAddress}, ${toWard}, ${toDistrict}, ${toProvince}`,
    );
    const toGeometry = toGeometryData.results[0].geometry.location;

    const fromGeometryString = `${formGeometry.lat},${formGeometry.lng}`;
    const toGeometryString = `${toGeometry.lat},${toGeometry.lng}`;

    const distanceData = await getDistance(
      fromGeometryString,
      toGeometryString,
    );

    distance = +distanceData.rows[0].elements[0].distance.text.split(' ')[0];

    const estimateTime =
      +distanceData.rows[0].elements[0].duration.text.split(' ')[0];

    if (distance > 2.5) {
      totalFee = totalFee + (distance - 2.5) * 1500;
    }

    if (weightBox > 1000) {
      totalFee = totalFee + ((weightBox - 1000) / 1000) * 1500;
    }

    if (estimateTime > 15) {
      totalFee = totalFee + (estimateTime - 15) * 1500;
    }

    if (lengthBox * widthBox * heightBox > 500000) {
      totalFee = totalFee * 1.5;
    }

    const dataReturn = {
      distance,
      totalFee,
      weight: Math.round(weightBox),
      dimension: `${lengthBox}|${widthBox}|${heightBox}`,
      insuranceValue,
    };

    return {
      code: 200,
      data: dataReturn,
    };
  }

  //get All for admin
  @get('/ordersKiot')
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
  async find(@param.filter(Order) filter?: Filter<Order>): Promise<any> {
    const data = await this.orderKiotRepository.find(filter);
    return {
      code: 200,
      data,
    };
  }

  @get('/ordersKiot/{idOfUser}')
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
  ): Promise<any> {
    const data = await this.orderKiotRepository.find({where: {idOfUser}});
    return {
      code: 200,
      data,
    };
  }

  @get('/ordersKiot/{idOfShop}')
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
  async findByShop(
    @param.path.string('idOfShop') idOfShop: string,
  ): Promise<any> {
    const data = await this.orderKiotRepository.find({where: {idOfShop}});
    return {
      code: 200,
      data,
    };
  }

  //
}
