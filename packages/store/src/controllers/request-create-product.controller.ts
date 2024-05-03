// Uncomment these imports to begin using these cool features!

// import {inject} from '@loopback/core';

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
  Response,
  Request,
} from '@loopback/rest';
import {Product, RequestCreateProduct} from '../models';
import {
  CategoryRepository,
  ProductRepository,
  RequestCreatProductRepository,
} from '../repositories';

import {uploadFile, deleteRemoteFile} from '../config/firebaseConfig';
import multer from 'multer';
import {inject} from '@loopback/core';

const storage = multer.memoryStorage();
const upload = multer({storage});

var cpUpload = upload.fields([{name: 'images'}]);

export class RequestCreateProductController {
  constructor(
    @repository(RequestCreatProductRepository)
    public requestCreatProductRepository: RequestCreatProductRepository,
    @repository(ProductRepository)
    public productRepository: ProductRepository,

    @repository(CategoryRepository)
    public categoryRepository: CategoryRepository,
  ) {}

  //
  @post('/request-create-product/shop/{idOfShop}/category/{idOfCategory}')
  @response(200, {
    description: 'Product model instance',
    content: {'application/json': {schema: getModelSchemaRef(Product)}},
  })
  async create(
    @param.path.string('idOfShop') idOfShop: string,
    @param.path.string('idOfCategory') idOfCategory: string,
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
    const {
      idOfKiot,
      isOnlineProduct,
      isKiotProduct,
      name,
      productDescription,
      price,
      productDetails,
      countInStock,
      isBestSeller,
      weight,
      dimension,
    } = data.body;

    if (!idOfKiot && isKiotProduct) {
      return {
        code: 400,
        message: 'Missing idOfKiot',
      };
    }

    if (
      !(
        name &&
        productDescription &&
        productDetails &&
        price &&
        weight &&
        dimension
      )
    ) {
      return {
        code: 400,
        message: 'Missing required fields',
      };
    }

    if (!data.files.images) {
      return {
        code: 400,
        message: 'Missing image',
      };
    }

    const category = await this.categoryRepository.findById(idOfCategory);

    if (!category) {
      return {
        code: 400,
        message: 'Category not found',
      };
    }

    const cateName = category.cateName;
    const image = await Promise.all(
      data.files.images.map(async (image: any) => {
        const dataImg: any = await uploadFile(image);
        return {
          url: dataImg.url,
          filename: dataImg.filename,
        };
      }),
    );
    if (!idOfKiot) {
      const time = new Date().toLocaleString();

      const product = {
        name,
        image,
        idOfCategory,
        idOfShop,
        productDescription,
        productDetails,
        price,
        countInStock,
        isBestSeller,
        cateName,
        status: 'pending',
        weight,
        dimension,
        isOnlineProduct,
        isKiotProduct,
        createdAt: time,
        updatedAt: time,
        createdBy: `shop-${idOfShop}`,
        updatedBy: `shop-${idOfShop}`,
      };

      const data = await this.requestCreatProductRepository.create(product);
      return data;
    } else {
      const time = new Date().toLocaleString();
      const product = {
        name,
        image,
        idOfCategory,
        idOfShop,
        isOnlineProduct,
        isKiotProduct,
        idOfKiot,
        productDescription,
        productDetails,
        price,
        countInStock,
        isBestSeller,
        cateName,
        status: 'pending',
        weight,
        dimension,
        createdAt: time,
        updatedAt: time,
        createdBy: `shop-${idOfShop}`,
        updatedBy: `shop-${idOfShop}`,
      };
      const data = await this.requestCreatProductRepository.create(product);
      return {
        code: 200,
        data,
      };
    }
  }

  // 
  @post('/request-create-product/{idOfRequest}/accepted/admin/{idOfAdmin}')
  @response(200, {
    description: 'Product model instance',
    content: {'application/json': {schema: getModelSchemaRef(Product)}},
  })
  async accepted(
    @param.path.string('idOfRequest') idOfRequest: string,
    @param.path.string('idOfAdmin') idOfAdmin: string,
  ): Promise<any> {
    const requestData: any =
      await this.requestCreatProductRepository.findById(idOfRequest);
    const {
      name,
      productDescription,
      price,
      productDetails,
      countInStock,
      isBestSeller,
      weight,
      dimension,
      isKiotProduct,
      isOnlineProduct,
      idOfKiot,
      image,
      idOfCategory,
      idOfShop,
      cateName,
      status
    } = requestData;

    if (status != 'pending') return {
      code: 400,
      message: 'Request is processed or rejected already',
    }

    const newProduct: any = {
      name,
      productDescription,
      price,
      productDetails,
      countInStock,
      isBestSeller,
      weight,
      dimension,
      isKiotProduct,
      isOnlineProduct,
      image,
      idOfCategory,
      idOfShop,
      cateName,
      status: 'active',
      rating: 0,
      createdAt: new Date().toLocaleString(),
      updatedAt: new Date().toLocaleString(),
      createdBy: `shop-${requestData.idOfShop}`,
      updatedBy: `admin-${idOfAdmin}`,
    };

    if (idOfKiot) newProduct.idOfKiot = idOfKiot;

    const dataProduct = await this.productRepository.create(newProduct);
    await this.requestCreatProductRepository.updateById(idOfRequest, {
      status: 'accepted',
      updatedAt: new Date().toLocaleString(),
      updatedBy: `admin-${idOfAdmin}`,
    });

    return {
      code: 200,
      data: dataProduct,
    };
  }

  @post('/request-create-product/{idOfRequest}/rejected/admin/{idOfAdmin}')
  @response(200, {
    description: 'Product model instance',
    content: {'application/json': {schema: getModelSchemaRef(Product)}},
  })
  async rejected(
    @param.path.string('idOfRequest') idOfRequest: string,
    @param.path.string('idOfAdmin') idOfAdmin: string,
  ): Promise<any> {
    if (
      (await this.requestCreatProductRepository.findById(idOfRequest)).status !=
      'pending'
    )
      return {
        code: 400,
        message: 'Request is processed or accepted already',
      };

    await this.requestCreatProductRepository.updateById(idOfRequest, {
      status: 'rejected',
      updatedAt: new Date().toLocaleString(),
      updatedBy: `admin-${idOfAdmin}`,
    });

    return {
      code: 200,
      data: await this.requestCreatProductRepository.findById(idOfRequest),
    };
  }

  @get('/request-create-product')
  @response(200, {
    description: 'Array of Product model instances',
    content: {
      'application/json': {
        schema: {
          type: 'object',
        },
      },
    },
  })
  async find(@param.filter(RequestCreateProduct) filter?: Filter<RequestCreateProduct>): Promise<any> {
    const data = await this.requestCreatProductRepository.find(filter);
    return {
      code: 200,
      data,
    };
  }

  @get('/request-create-product/{id}')
  @response(200, {
    description: 'Product model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Product, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Product, {exclude: 'where'})
    filter?: FilterExcludingWhere<Product>,
  ): Promise<RequestCreateProduct> {
    return this.requestCreatProductRepository.findById(id, filter);
  }

  @patch('/request-create-product/shop/{idOfShop}/category/{idOfCategory}/{id}')
  @response(204, {
    description: 'Product PATCH success',
  })
  async updateById(
    @param.path.string('idOfShop') idOfShop: string,
    @param.path.string('idOfCategory') idOfCategory: string,
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
    const {
      name,
      productDescription,
      price,
      productDetails,
      countInStock,
      isBestSeller,
      weight,
      dimension,
      isKiotProduct,
      isOnlineProduct,
      idOfKiot,
    } = data.body;

    if (!idOfKiot && isKiotProduct) {
      return {
        code: 400,
        message: 'Missing idOfKiot',
      };
    }

    const category = await this.categoryRepository.findById(idOfCategory);
    const oldImage: any = (
      await this.requestCreatProductRepository.findById(id)
    ).image;

    if (!category) {
      return {
        code: 400,
        message: 'Category not found',
      };
    }

    const cateName = category.cateName;

    if (data.files.images?.length > 0) {
      const image = await Promise.all(
        data.files.images.map(async (image: any) => {
          const dataImg: any = await uploadFile(image);
          return {
            url: dataImg.url,
            filename: dataImg.filename,
          };
        }),
      );
      const time = new Date().toLocaleString();
      let product: any = {
        name,
        image,
        idOfCategory,
        idOfShop,
        isKiotProduct,
        isOnlineProduct,
        productDescription,
        productDetails,
        price,
        countInStock,
        isBestSeller,
        cateName,
        weight,
        dimension,
        updatedAt: time,
        updatedBy: `shop-${idOfShop}`,
      };

      if (idOfKiot) product.idOfKiot = idOfKiot;

      await this.requestCreatProductRepository.updateById(id, product);

      if (oldImage.length > 0) {
        await Promise.all(
          oldImage.map(async (img: any) => {
            await deleteRemoteFile(img.filename);
          }),
        );
      }
    } else {
      const time = new Date().toLocaleString();
      const product = {
        name,
        idOfCategory,
        idOfShop,
        isKiotProduct,
        isOnlineProduct,
        idOfKiot: isKiotProduct ? idOfKiot : null,
        productDescription,
        productDetails,
        price,
        countInStock,
        isBestSeller,
        cateName,
        weight,
        dimension,
        updatedAt: time,
        updatedBy: `shop-${idOfShop}`,
      };
      if (idOfKiot) product.idOfKiot = idOfKiot;

      await this.requestCreatProductRepository.updateById(id, product);
    }

    const dataReturn = await this.requestCreatProductRepository.findById(id);

    return {
      code: 200,
      data: dataReturn,
    };
  }

  @del('/products/{id}')
  @response(204, {
    description: 'Product DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.requestCreatProductRepository.deleteById(id);
  }
}
