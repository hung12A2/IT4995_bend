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
import {Transaction, TransactionShop} from '../models';
import {TransactionShopRepository} from '../repositories';

export class TransactionforshopController {
  constructor(
    @repository(TransactionShopRepository)
    public transactionShopRepository: TransactionShopRepository,
  ) {}

  @get('/transaction-shops/days/{numberOfDays}/shop/{idOfShop}')
  @response(200, {
    description: 'Array of Order model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(TransactionShop, {includeRelations: true}),
        },
      },
    },
  })
  async find10dayShop(
    @param.path.number('numberOfDays') numberOfDays: number,
    @param.path.string('idOfShop') idOfShop: string,
  ): Promise<any> {
    console.log('idOfShop', idOfShop);

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

    // Lấy tất cả đơn hàng thỏa mãn điều kiện lọc
    const transactions = await this.transactionShopRepository.find(filter);

    // Nhóm và đếm số lượng đơn hàng theo ngày, loại bỏ thời gian
    const transactionsCountByDay: {[key: string]: string} = transactions.reduce(
      (acc: any, transaction) => {
        // Chỉ lấy phần ngày, loại bỏ thời gian
        const day = new Date(transaction.createdAt).toLocaleDateString('en-US');
        if (!acc[day]) {
          acc[day] = 0;
        }
        acc[day] += transaction.amountMoney;
        return acc;
      },
      {},
    );

    const transactionsCountByDay2: {[key: string]: string} = transactions.reduce(
      (acc: any, transaction) => {
        // Chỉ lấy phần ngày, loại bỏ thời gian
        const day = new Date(transaction.createdAt).toLocaleDateString('en-US');
        if (!acc[day]) {
          acc[day] = 0;
        }
        acc[day] ++
        return acc;
      },
      {},
    );


    // Đảm bảo mỗi ngày trong khoảng 10 ngày trước đều có trong kết quả, ngay cả khi không có đơn hàng nào
    allDays.forEach(day => {
      // day ở đây cũng phải được định dạng chỉ với ngày, không có thời gian
      if (!transactionsCountByDay[day]) {
        transactionsCountByDay[day] = '0'; // Thêm ngày không có đơn hàng với giá trị '0'
      }

      if (!transactionsCountByDay2[day]) {
        transactionsCountByDay2[day] = '0'; // Thêm ngày không có đơn hàng với giá trị '0'
      }
    });

    // Chuyển đổi số lượng đơn hàng thành chuỗi
    const formattedOrdersCountByDay: {[key: string]: string} = Object.keys(
      transactionsCountByDay,
    ).reduce((acc: any, day) => {
      acc[day] = transactionsCountByDay[day].toString();
      return acc;
    }, {});

     // Chuyển đổi số lượng đơn hàng thành chuỗi
     const formattedOrdersCountByDay2: {[key: string]: string} = Object.keys(
      transactionsCountByDay2,
    ).reduce((acc: any, day) => {
      acc[day] = transactionsCountByDay2[day].toString();
      return acc;
    }, {});

    const ordersArray = Object.entries(formattedOrdersCountByDay).map(
      ([name, order]) => ({
        name,
        revenue: order,
        numberTransaction: formattedOrdersCountByDay2[name],
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

  @get('/transaction-shops/sum/{numberOfDays}/shop/{idOfShop}')
  @response(200, {
    description: 'Array of Order model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(TransactionShop, {includeRelations: true}),
        },
      },
    },
  })
  async sum10days(
    @param.path.number('numberOfDays') numberOfDays: number,
    @param.path.string('idOfShop') idOfShop: string,
  ): Promise<any> {
    console.log('idOfShop', idOfShop);

    const tenDaysAgo = new Date();
    tenDaysAgo.setDate(tenDaysAgo.getDate() - numberOfDays);


    // Lọc các đơn hàng được tạo trong 10 ngày qua
    const filter = {
      where: {
        idOfShop,
        createdAt: {
          gte: tenDaysAgo.toLocaleString(), // Sử dụng ISO string cho so sánh ngày
        },
      },
    };

    // Lấy tất cả đơn hàng thỏa mãn điều kiện lọc
    const transactions = await this.transactionShopRepository.find(filter);

    // Nhóm và đếm số lượng đơn hàng theo ngày, loại bỏ thời gian
    let sum = 0;
    transactions.forEach(transaction => {
      sum += transaction.amountMoney;
    });

    return sum;
  }

  @post('/transaction-shops')
  @response(200, {
    description: 'TransactionShop model instance',
    content: {'application/json': {schema: getModelSchemaRef(TransactionShop)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TransactionShop, {
            title: 'NewTransactionShop',
            exclude: ['id'],
          }),
        },
      },
    })
    transactionShop: Omit<TransactionShop, 'id'>,
  ): Promise<TransactionShop> {
    return this.transactionShopRepository.create(transactionShop);
  }

  @get('/transaction-shops/count')
  @response(200, {
    description: 'TransactionShop model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(TransactionShop) where?: Where<TransactionShop>,
  ): Promise<Count> {
    return this.transactionShopRepository.count(where);
  }

  @get('/transaction-shops')
  @response(200, {
    description: 'Array of TransactionShop model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(TransactionShop, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(TransactionShop) filter?: Filter<TransactionShop>,
  ): Promise<TransactionShop[]> {
    return this.transactionShopRepository.find(filter);
  }

  @patch('/transaction-shops')
  @response(200, {
    description: 'TransactionShop PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TransactionShop, {partial: true}),
        },
      },
    })
    transactionShop: TransactionShop,
    @param.where(TransactionShop) where?: Where<TransactionShop>,
  ): Promise<Count> {
    return this.transactionShopRepository.updateAll(transactionShop, where);
  }

  @get('/transaction-shops/{id}')
  @response(200, {
    description: 'TransactionShop model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(TransactionShop, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(TransactionShop, {exclude: 'where'})
    filter?: FilterExcludingWhere<TransactionShop>,
  ): Promise<TransactionShop> {
    return this.transactionShopRepository.findById(id, filter);
  }

  @patch('/transaction-shops/{id}')
  @response(204, {
    description: 'TransactionShop PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TransactionShop, {partial: true}),
        },
      },
    })
    transactionShop: TransactionShop,
  ): Promise<void> {
    await this.transactionShopRepository.updateById(id, transactionShop);
  }

  @put('/transaction-shops/{id}')
  @response(204, {
    description: 'TransactionShop PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() transactionShop: TransactionShop,
  ): Promise<void> {
    await this.transactionShopRepository.replaceById(id, transactionShop);
  }

  @del('/transaction-shops/{id}')
  @response(204, {
    description: 'TransactionShop DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.transactionShopRepository.deleteById(id);
  }
}
