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
import {AddForm} from '../models';
import {
  AddFormRepository,
  ProductInAddFormRepository,
  ProductRepository,
} from '../repositories';

export class AddFormController {
  constructor(
    @repository(AddFormRepository)
    public addFormRepository: AddFormRepository,
    @repository(ProductInAddFormRepository)
    public productInAddFormRepository: ProductInAddFormRepository,
    @repository(ProductRepository)
    public productRepository: ProductRepository,
  ) {}

  @post('/add-forms')
  @response(200, {
    description: 'AddForm model instance',
    content: {'application/json': {schema: getModelSchemaRef(AddForm)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              idOfShop: {type: 'string'},
              note: {type: 'string'},
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
    addForm: any,
  ): Promise<any> {
    const {idOfShop, note, items} = addForm;
    const createdAt = new Date().toLocaleString();
    const addFormData = await this.addFormRepository.create({
      idOfShop,
      note,
      createdAt,
    });

    const data = await Promise.all(
      items?.map(async (item: any) => {
        await this.productInAddFormRepository.create({
          idOfProduct: item.idOfProduct,
          quantity: item.quantity,
          idOfForm: addFormData.id,
        });

        const oldProduct = await this.productRepository.findById(
          item.idOfProduct,
        );
        await this.productRepository.updateById(item.idOfProduct, {
          countInStock: oldProduct.countInStock + item.quantity,
        });
      }),
    );

    return addFormData;
  }

  @get('/add-forms/count')
  @response(200, {
    description: 'AddForm model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(AddForm) where?: Where<AddForm>): Promise<Count> {
    return this.addFormRepository.count(where);
  }

  @get('/add-forms')
  @response(200, {
    description: 'Array of AddForm model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(AddForm, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(AddForm) filter?: Filter<AddForm>): Promise<any> {
    const dataListForm = await this.addFormRepository.find(filter);
    const data = await Promise.all(
      dataListForm.map(async (item: any) => {
        let items = await this.productInAddFormRepository.find({
          where: {
            idOfForm: item.id,
          },
        });
        let listProductId = items.map((item: any) => item.idOfProduct);
        let listProduct = await this.productRepository.find({
          where: {
            id: {
              inq: listProductId,
            },
          },
        });
        items = items.map((item: any) => {
          const product = listProduct.find(
            (product: any) => product.id === item.idOfProduct,
          );
          return {
            ...item,
            product,
          };
        });
        return {
          ...item,
          items,
        };
      }),
    );

    return data;
  }

  @get('/add-forms/{id}')
  @response(200, {
    description: 'AddForm model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(AddForm, {includeRelations: true}),
      },
    },
  })
  async findById(@param.path.string('id') id: string): Promise<any> {
    const dataListForm = await this.addFormRepository.findById(id);
    let dataProductInForm = await this.productInAddFormRepository.find({where: {
      idOfForm: dataListForm?.id
    }})

    let listProductId = dataProductInForm.map((item: any) => item.idOfProduct);
    let listProduct = await this.productRepository.find({
      where: {
        id: {
          inq: listProductId,
        },
      },
    });

    dataProductInForm = dataProductInForm.map((item: any) => { 
      const product = listProduct.find(
        (product: any) => product.id === item.idOfProduct,
      );
      return {
        ...item,
        product,
      };
    })

    return {
      ...dataListForm,
      items: dataProductInForm
    };
  }
}
