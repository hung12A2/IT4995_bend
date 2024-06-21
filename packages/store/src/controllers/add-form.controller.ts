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
              type: {type: 'string'},
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
    const {idOfShop, note, items, type} = addForm;
    const createdAt = new Date().toLocaleString();
    const addFormData = await this.addFormRepository.create({
      idOfShop,
      note,
      createdAt,
      type,
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
        if (type == 'import') {
          await this.productRepository.updateById(item.idOfProduct, {
            countInStock: oldProduct.countInStock + item.quantity,
          });
        } else {
          await this.productRepository.updateById(item.idOfProduct, {
            countInStock: oldProduct.countInStock - item.quantity,
          });
        }
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
    return dataListForm;
  }

  @get('/product-in-add-forms')
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
  async findProduct(@param.filter(AddForm) filter?: Filter<AddForm>): Promise<any> {
    const dataListForm = await this.productInAddFormRepository.find(filter);
    return dataListForm;
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
    return dataListForm;
  }


}
