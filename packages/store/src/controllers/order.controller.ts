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
} from '@loopback/rest';
import {Order} from '../models';
import {
  OrderRepository,
  ProductRepository,
  ProductsInCartRepository,
  ProductsInOrderRepository,
} from '../repositories';
import axios from 'axios';

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
    @repository(OrderRepository)
    public orderRepository: OrderRepository,
    @repository(ProductsInCartRepository)
    public productsInCartRepository: ProductsInCartRepository,
    @repository(ProductRepository)
    public productRepository: ProductRepository,
    @repository(ProductsInOrderRepository)
    public productsInOrderRepository: ProductsInOrderRepository,
  ) {}

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

  @post('/orders/accepted/{idOfShop}/order-id/{id}')
  @response(200, {description: 'Order model instance'})
  async accepted(
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

        await this.orderRepository.updateById(id, {status: 'accepted'});

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

  @post('/orders/rejected/{idOfShop}/order-id/{id}')
  @response(200, {
    description: 'Order model instance',
    content: {'application/json': {schema: getModelSchemaRef(Order)}},
  })
  async rejected(
    @param.path.string('idOfShop') idOfShop: string,
    @param.path.string('id') id: string,
  ): Promise<any> {
    try {
      const order = await this.orderRepository.find({where: {id, idOfShop}});
      if (order.length == 1) {
        await this.orderRepository.updateById(id, {status: 'rejected'});
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
        await this.orderRepository.updateById(id, {status: 'canceled'});
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
        'application/json': {
          schema: getModelSchemaRef(Order, {partial: true}),
        },
      },
    })
    order: Omit<Order, 'id'>,
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
      codAmount,
      note,
      requiredNote,
    } = order;

    let weightBox = 0;
    let lengthBox = 0;
    let widthBox = 0;
    let heightBox = 0;
    let insuranceValue = 0;

    const productsInCart = await this.productsInCartRepository.find({
      where: {idOfUser},
    });

    await Promise.all(
      productsInCart.map(async (productInCart: any) => {
        const idProduct = productInCart.idOfProduct;
        const product: any = await this.productRepository.findById(idProduct);
        const {name, price, image, dimension, weight} = product;
        const dimensionList = dimension.split('|');
        weightBox += weight * productInCart.quantity;
        const length = +dimensionList[0];
        const width = +dimensionList[1];
        const height = +dimensionList[2];

        insuranceValue += price * productInCart.quantity;

        if (length > lengthBox) {
          lengthBox = length;
        }

        if (width > widthBox) {
          widthBox = width;
        }

        heightBox += height * productInCart.quantity;

        return {
          name,
          price,
          image,
          quantity: productInCart.quantity,
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
    const clientOrderCode = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0');

    const NewOrder = {
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
      codAmount,
      note,
      requiredNote,
      idOfShop,
      idOfUser,
      weight: Math.round(weightBox),
      dimension,
      insuranceValue,
      clientOrderCode,
      status: 'pending',
    };

    const dataOrder = await this.orderRepository.create(NewOrder);
    const idOrder = dataOrder.id;
    await Promise.all(
      await productsInCart.map(async (productInCart: any) => {
        const idProduct = productInCart.idOfProduct;
        await this.productsInOrderRepository.create({
          idOfOrder: idOrder,
          idOfProduct: idProduct,
          quantity: productInCart.quantity,
        });
      }),
    );
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
