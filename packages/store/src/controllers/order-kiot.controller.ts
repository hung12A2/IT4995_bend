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
  KiotInfoRepository,
  OrderKiotRepository,
  OrderRepository,
  ProductRepository,
  ProductsInCartRepository,
  ProductsInOrderKiotRepository,
  ProductsInOrderRepository,
  ReturnOrderRepository,
  ShopInfoRepository,
  UserInfoRepository,
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
    @repository(UserInfoRepository)
    public userInfoRepository: UserInfoRepository,
    @repository(KiotInfoRepository)
    public kiotInfoRepository: KiotInfoRepository,
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

  @post('/ordersKiot/delivered/{idOfShop}/order-id/{id}')
  @response(200, {
    description: 'Order model instance',
    content: {'application/json': {schema: getModelSchemaRef(Order)}},
  })
  async delivered(
    @param.path.string('idOfShop') idOfShop: string,
    @param.path.string('id') id: string,
  ): Promise<any> {
    try {
      const order: any = await this.orderKiotRepository.find({
        where: {id, idOfShop},
      });
      const oldLogs: any = order[0].logs;
      if (order.length == 1) {
        await this.orderKiotRepository.updateById(id, {
          status: 'deliverd',
          updatedAt: new Date().toLocaleString(),
          logs: [
            ...oldLogs,
            {
              status: 'deliverd',
              updatedAt: new Date().toLocaleString(),
            },
          ],
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
      const oldLogs: any = order[0].logs;
      if (order.length == 1) {
        await this.orderKiotRepository.updateById(id, {
          status: 'inTransist',
          updatedAt: new Date().toLocaleString(),
          logs: [
            ...oldLogs,
            {
              status: 'inTransist',
              updatedAt: new Date().toLocaleString(),
            },
          ],
        });

        const dataNoti = JSON.stringify({
          idOfUser: order[0].idOfUser,
          title: 'Dang tren hoa toc duong giao den ban',
          content: `Đơn hàng hoa toc ${id} dang tren duong giao den ban, chu y dien thoai nhe`,
          image: order[0].image,
          createdAt: new Date().toLocaleString(),
          idOfOrder: order[0]?.id,
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
      const oldLogs: any = order[0].logs;
      if (order.length == 1) {
        await this.orderKiotRepository.updateById(id, {
          status: 'prepared',
          updatedAt: new Date().toLocaleString(),
          logs: [
            ...oldLogs,
            {
              status: 'prepared',
              updatedAt: new Date().toLocaleString(),
            },
          ],
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
      const oldLogs: any = order[0].logs;
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
          logs: [
            ...oldLogs,
            {
              status: 'rejected',
              updatedAt: new Date().toLocaleString(),
            },
          ],
        });

        const oldShopInfo: any = await this.shopInfoRepository.findOne({
          where: {idOfShop},
        });
        await this.shopInfoRepository.updateAll(
          {
            numberOfRejectedOrder: oldShopInfo.numberOfRejectedOrder + 1,
          },
          {idOfShop},
        );

        const oldKiotInfo: any = await this.kiotInfoRepository.findOne({
          where: {idOfShop},
        });

        await this.kiotInfoRepository.updateAll(
          {
            numberOfRejectedOrder: oldKiotInfo.numberOfRejectedOrder + 1,
          },
          {idOfShop},
        );

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
            title: 'Đơn hàng hoa toc đã bị hủy',
            content: `Đơn hàng hoa toc ${id} đã bi huy ${order[0]?.priceOfAll} da duoc hoan lai vao tai khoan cua ban. Chung toi xin loi vi su bat tien nay`,
            createdAt: new Date().toLocaleString(),
            image: order?.[0]?.image,
            idOfOrder: order[0]?.id,
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
            typeOrder: 'kiot',
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
    @requestBody({
      description: 'no desc',
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
    try {
      const content = request?.content;
      const requiredNote = request?.requiredNote;
      const order = await this.orderKiotRepository.find({
        where: {id, idOfShop},
      });
      const idOfOrder = order[0].id;

      const oldLogs: any = order[0].logs;

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

        if (!content) {
          await this.orderKiotRepository.updateById(id,  {
            status: 'accepted',
            updatedAt: new Date().toLocaleString(),
            logs: [
              ...oldLogs,
              {
                status: 'accepted',
                updatedAt: new Date().toLocaleString(),
              },
            ],
            requiredNote,
          });
        } else {
          await this.orderKiotRepository.updateById(id, {
            status: 'accepted',
            updatedAt: new Date().toLocaleString(),
            content,
            requiredNote,
            logs: [
              ...oldLogs,
              {
                status: 'accepted',
                updatedAt: new Date().toLocaleString(),
              },
            ],
          });
        }
        const dataNoti = JSON.stringify({
          idOfUser: order[0].idOfUser,
          title: 'Đơn hàng hoa toc đã được chấp nhận',
          content: `Đơn hàng hoa toc ${id} đã duoc chap nhan. Vui long kiem tra lai thong tin don hang trong phan Chi tiet don hang va tin nhan (neu co) tai Luna Chat kenh lien he duy nhat danh cho nguoi ban nhe`,
          createdAt: new Date().toLocaleString(),
          image: order[0]?.image,
          idOfOrder: order[0]?.id,
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
      const oldLogs: any = order.logs;
      if (order) {
        await this.orderKiotRepository.updateById(id, {
          status: 'received',
          updatedAt: new Date().toLocaleString(),
          logs: [
            ...oldLogs,
            {
              status: 'received',
              updatedAt: new Date().toLocaleString(),
            },
          ],
        });

        const oldShopInfo: any = await this.shopInfoRepository.findOne({
          where: {
            idOfShop: order.idOfShop,
          },
        });

        const oldKiotInfo: any = await this.kiotInfoRepository.findOne({
          where: {
            idOfShop: order.idOfShop,
          },
        });

        await this.kiotInfoRepository.updateAll(
          {
            numberOfSuccesOrder: oldKiotInfo.numberOfSuccesOrder + 1,
          },
          {idOfShop: order.idOfShop},
        );

        await this.shopInfoRepository.updateAll(
          {
            numberOfSuccesOrder: oldShopInfo.numberOfSuccesOrder + 1,
          },
          {idOfShop: order.idOfShop},
        );

        const oldUserInfo: any = await this.userInfoRepository.findOne({
          where: {idOfUser},
        });
        await this.userInfoRepository.updateAll(
          {
            numberOfSuccesOrder: oldUserInfo.numberOfSuccesOrder + 1,
          },
          {idOfUser},
        );

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
          title: 'Đơn hàng hoa toc đã được nhận',
          content: `Đơn hàng hoa toc ${id} đã được nhận ${order.priceOfAll - order.totalFee} đã được chuyển vào tài khoản của shop vao ${new Date().toLocaleString()}`,
          image: order.image,
          createdAt: new Date().toLocaleString(),
          idOfOrder: order.id,
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
          typeOrder: 'kiot',
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

            const oldKiotInfo: any = await this.kiotInfoRepository.findOne({
              where: {idOfShop: order.idOfShop},
            });

            await this.kiotInfoRepository.updateAll(
              {numberOfSold: oldKiotInfo.numberOfSold + quantity},
              {idOfShop: order.idOfShop},
            );

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
      const oldLogs: any = order[0].logs;
      const idOfShop = order[0].idOfShop;
      if (order.length == 1) {
        await this.orderKiotRepository.updateById(id, {
          status: 'returned',
          updatedAt: new Date().toLocaleString(),
          logs: [
            ...oldLogs,
            {
              status: 'returned',
              updatedAt: new Date().toLocaleString(),
            },
          ],
        });

        const oldShopInfo: any = await this.shopInfoRepository.findOne({
          where: {idOfShop},
        });

        const oldKiotInfo: any = await this.kiotInfoRepository.findOne({
          where: {idOfShop},
        });

        await this.kiotInfoRepository.updateAll(
          {
            numberOfReturnOrder: oldKiotInfo.numberOfReturnOrder + 1,
          },
          {idOfShop},
        );

        await this.shopInfoRepository.updateAll(
          {
            numberOfReturnOrder: oldShopInfo.numberOfReturnOrder + 1,
          },
          {idOfShop},
        );

        const oldUserInfo: any = await this.userInfoRepository.findOne({
          where: {idOfUser},
        });
        await this.userInfoRepository.updateAll(
          {
            numberOfReturnOrder: oldUserInfo.numberOfReturnOrder + 1,
          },
          {idOfUser},
        );

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

          const dataTransaction = JSON.stringify({
            idOfUser,
            amountMoney: order[0].priceOfAll,
            type: 'receive',
            typeOrder: 'kiot',
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
      const oldLogs: any = order[0].logs;
      if (order.length == 1) {
        await this.orderKiotRepository.updateById(id, {
          status: 'canceled',
          updatedAt: new Date().toLocaleString(),
          logs: [
            ...oldLogs,
            {
              status: 'canceled',
              updatedAt: new Date().toLocaleString(),
            },
          ],
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
            content: `Đơn hàng hoa toc ${id} đã được hủy và ${order[0]?.priceOfAll} đã được hoàn lại vào tài khoản của bạn. Chuc ban mua sam vui ve`,
            createdAt: new Date().toLocaleString(),
            image: order[0]?.image,
            title: 'Đơn hàng hoa toc đã duoc hủy',
            idOfOrder: order[0]?.id,
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
            typeOrder: 'kiot',
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
          content: `Đơn hàng hoa toc ${id} đã bi huy luc ${new Date().toLocaleString()}`,
          title: 'Đơn hàng hoa toc đã bị hủy',
          image: order[0].image,
          createdAt: new Date().toLocaleString(),
          idOfOrder: order[0].id,
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
          imageOrder = image[0];
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
      logs: [
        {
          status: 'pending',
          updatedAt: time,
        },
      ],
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

    const oldShopInfo: any = await this.shopInfoRepository.findOne({
      where: {idOfShop},
    });

    const oldKiotInfo: any = await this.kiotInfoRepository.findOne({
      where: {idOfShop},
    });

    await this.kiotInfoRepository.updateAll(
      {
        numberOfOrder: oldKiotInfo.numberOfOrder + 1,
      },
      {idOfShop},
    );

    await this.shopInfoRepository.updateAll(
      {
        numberOfOrder: oldShopInfo.numberOfOrder + 1,
      },
      {idOfShop},
    );

    const oldUserInfo: any = await this.userInfoRepository.findOne({
      where: {idOfUser},
    });
    await this.userInfoRepository.updateAll(
      {
        numberOfOrder: oldUserInfo.numberOfOrder + 1,
      },
      {idOfUser},
    );

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
      title: `Đơn hang hoa toc moi`,
      content: `Đơn hàng hoa toc ${idOrder} đã được tạo thành công voi gia tien ${priceOfAll} luc ${new Date().toLocaleString()}`,
      image: imageOrder,
      createdAt: new Date().toLocaleString(),
      idOfOrder: idOrder,
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
        typeOrder: 'kiot',
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

    if (distance > 20) {
      distance = distance / 1000;
    }
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
      totalFee: Math.round(totalFee),
      weight: Math.round(weightBox),
      dimension: `${lengthBox}|${widthBox}|${heightBox}`,
      insuranceValue,
      estimateTime,
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

  @get('/ordersKiot/days/{numberOfDays}')
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
  async find10day(
    @param.path.number('numberOfDays') numberOfDays: number,
  ): Promise<any> {
    const tenDaysAgo = new Date();
    tenDaysAgo.setDate(tenDaysAgo.getDate() - numberOfDays);

    const allDays = Array.from({length: numberOfDays}, (_, i) => {
      const date = new Date(tenDaysAgo);
      date.setDate(date.getDate() + i);
      return date.toLocaleString().split(', ')[0];
    });

    // Lọc các đơn hàng được tạo trong 10 ngày qua
    const filter = {
      where: {
        createdAt: {
          gte: tenDaysAgo.toLocaleString(), // Sử dụng ISO string cho so sánh ngày
        },
      },
    };

    const filter2 = {
      where: {
        status: 'received', // Sử dụng ISO string cho so sánh ngày
        createdAt: {
          gte: tenDaysAgo.toLocaleString(), // Sử dụng ISO string cho so sánh ngày
        },
      },
    };

    // Lấy tất cả đơn hàng thỏa mãn điều kiện lọc
    const orders = await this.orderKiotRepository.find(filter);

    const orders2 = await this.orderKiotRepository.find(filter2);

    // Nhóm và đếm số lượng đơn hàng theo ngày, loại bỏ thời gian
    const ordersCountByDay: {[key: string]: string} = orders.reduce(
      (acc: any, order) => {
        // Chỉ lấy phần ngày, loại bỏ thời gian
        const day = new Date(order.createdAt).toLocaleDateString('en-US');
        if (!acc[day]) {
          acc[day] = 0;
        }
        acc[day]++;
        return acc;
      },
      {},
    );

    const ordersCountByDay2: {[key: string]: string} = orders2.reduce(
      (acc: any, order) => {
        // Chỉ lấy phần ngày, loại bỏ thời gian
        const day = new Date(order.createdAt).toLocaleDateString('en-US');
        if (!acc[day]) {
          acc[day] = 0;
        }
        acc[day]++;
        return acc;
      },
      {},
    );

    // Đảm bảo mỗi ngày trong khoảng 10 ngày trước đều có trong kết quả, ngay cả khi không có đơn hàng nào
    allDays.forEach(day => {
      // day ở đây cũng phải được định dạng chỉ với ngày, không có thời gian
      if (!ordersCountByDay[day]) {
        ordersCountByDay[day] = '0'; // Thêm ngày không có đơn hàng với giá trị '0'
      }

      if (!ordersCountByDay2[day]) {
        ordersCountByDay2[day] = '0'; // Thêm ngày không có đơn hàng với giá trị '0'
      }
    });

    // Chuyển đổi số lượng đơn hàng thành chuỗi
    const formattedOrdersCountByDay: {[key: string]: string} = Object.keys(
      ordersCountByDay,
    ).reduce((acc: any, day) => {
      acc[day] = ordersCountByDay[day].toString();
      return acc;
    }, {});

    const formattedOrdersCountByDay2: {[key: string]: string} = Object.keys(
      ordersCountByDay2,
    ).reduce((acc: any, day) => {
      acc[day] = ordersCountByDay2[day].toString();
      return acc;
    }, {});

    const ordersArray = Object.entries(formattedOrdersCountByDay).map(
      ([name, order]) => ({
        name,
        order,
        orderSuccess: formattedOrdersCountByDay2[name] || 0,
      }),
    );

    
    const sortedOrdersArray = ordersArray.sort((a, b) => {
      // Convert name to Date object for comparison
      const dateA = new Date(a.name);
      const dateB = new Date(b.name);
    
      return dateA.getTime() - dateB.getTime();
    });
    
    return sortedOrdersArray;
  }

  @get('/ordersKiotShop/days/{numberOfDays}/shop/{idOfShop}')
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
  async find10dayShop(
    @param.path.string('idOfShop') idOfShop: string,
    @param.path.number('numberOfDays') numberOfDays: number,
  ): Promise<any> {
    const tenDaysAgo = new Date();
    tenDaysAgo.setDate(tenDaysAgo.getDate() - numberOfDays);

    const allDays = Array.from({length: numberOfDays}, (_, i) => {
      const date = new Date(tenDaysAgo);
      date.setDate(date.getDate() + i);
      return date.toLocaleString().split(', ')[0];
    });

    // Lọc các đơn hàng được tạo trong 10 ngày qua
    const filter = {
      where: {
        idOfShop,
        createdAt: {
          gte: tenDaysAgo.toLocaleString(), // Sử dụng ISO string cho so sánh ngày
        },
      },
    };

    const filter2 = {
      where: {
        idOfShop,
        status: 'received', // Sử dụng ISO string cho so sánh ngày
        createdAt: {
          gte: tenDaysAgo.toLocaleString(), // Sử dụng ISO string cho so sánh ngày
        },
      },
    };

    // Lấy tất cả đơn hàng thỏa mãn điều kiện lọc
    const orders = await this.orderKiotRepository.find(filter);

    const orders2 = await this.orderKiotRepository.find(filter2);

    // Nhóm và đếm số lượng đơn hàng theo ngày, loại bỏ thời gian
    const ordersCountByDay: {[key: string]: string} = orders.reduce(
      (acc: any, order) => {
        // Chỉ lấy phần ngày, loại bỏ thời gian
        const day = new Date(order.createdAt).toLocaleDateString('en-US');
        if (!acc[day]) {
          acc[day] = 0;
        }
        acc[day]++;
        return acc;
      },
      {},
    );

    const ordersCountByDay2: {[key: string]: string} = orders2.reduce(
      (acc: any, order) => {
        // Chỉ lấy phần ngày, loại bỏ thời gian
        const day = new Date(order.createdAt).toLocaleDateString('en-US');
        if (!acc[day]) {
          acc[day] = 0;
        }
        acc[day]++;
        return acc;
      },
      {},
    );

    // Đảm bảo mỗi ngày trong khoảng 10 ngày trước đều có trong kết quả, ngay cả khi không có đơn hàng nào
    allDays.forEach(day => {
      // day ở đây cũng phải được định dạng chỉ với ngày, không có thời gian
      if (!ordersCountByDay[day]) {
        ordersCountByDay[day] = '0'; // Thêm ngày không có đơn hàng với giá trị '0'
      }

      if (!ordersCountByDay2[day]) {
        ordersCountByDay2[day] = '0'; // Thêm ngày không có đơn hàng với giá trị '0'
      }
    });

    // Chuyển đổi số lượng đơn hàng thành chuỗi
    const formattedOrdersCountByDay: {[key: string]: string} = Object.keys(
      ordersCountByDay,
    ).reduce((acc: any, day) => {
      acc[day] = ordersCountByDay[day].toString();
      return acc;
    }, {});

    const formattedOrdersCountByDay2: {[key: string]: string} = Object.keys(
      ordersCountByDay2,
    ).reduce((acc: any, day) => {
      acc[day] = ordersCountByDay2[day].toString();
      return acc;
    }, {});

    const ordersArray = Object.entries(formattedOrdersCountByDay).map(
      ([name, order]) => ({
        name,
        order,
        orderSuccess: formattedOrdersCountByDay2[name] || '0',
      }),
    );

    
    const sortedOrdersArray = ordersArray.sort((a, b) => {
      // Convert name to Date object for comparison
      const dateA = new Date(a.name);
      const dateB = new Date(b.name);
    
      return dateA.getTime() - dateB.getTime();
    });
    
    return sortedOrdersArray;
  }

  @get('/ordersKiot/count')
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
  async count(@param.filter(Order) filter?: Filter<Order>): Promise<any> {
    const data = await this.orderKiotRepository.find(filter);
    return {
      code: 200,
      data,
    };
  }

  @get('/ordersKiot/{id}')
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
  async getOne(@param.path.string('id') id: string): Promise<any> {
    const data = await this.orderKiotRepository.findById(id);
    return data;
  }

  @get('/ordersKiot/user/{idOfUser}')
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

  @get('/ordersKiot/shop/{idOfShop}')
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
    @param.query.object('filter') filter?: any,
  ): Promise<any> {
    let where: any;
    if (filter) {
      where = filter?.where || {};
      where = {...where, idOfShop};
      filter.where = where;
    }

    const data = await this.orderKiotRepository.find(filter);
    return data;
  }

  @get('/ordersKiot/shop/{idOfShop}/count')
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
  async countByShop(
    @param.path.string('idOfShop') idOfShop: string,
    @param.query.object('filter') filter?: any,
  ): Promise<any> {
    let where: any;
    if (filter) {
      where = filter?.where || {};
      where = {...where, idOfShop};
      filter.where = where;
    }

    const data = await this.orderKiotRepository.count(filter);
    return data;
  }

  //
}
