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
import {Product} from '../models';
import {CategoryRepository, ProductRepository} from '../repositories';

import {uploadFile, deleteRemoteFile} from '../config/firebaseConfig';
import multer from 'multer';
import {inject} from '@loopback/core';

const storage = multer.memoryStorage();
const upload = multer({storage});

var cpUpload = upload.fields([{name: 'image'}]);

export class RequestCreateProductController {
  constructor(
    @repository(ProductRepository)
    public productRepository: ProductRepository,
    @repository(CategoryRepository)
    public categoryRepository: CategoryRepository,
  ) {}

  @post('/products/shop/{idOfShop}/category/{idOfCategory}')
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

    const category = await this.categoryRepository.findById(idOfCategory);

    if (!category) {
      return response.status(400).send('Category not found');
    }

    const cateName = category.cateName;

    const imageData: any = await uploadFile(data.files.image[0]);
    if (!isKiotProduct) {
      const time = new Date().toLocaleString();

      const product = new Product({
        name,
        image: {
          url: imageData.url,
          filename: imageData.filename,
        },
        idOfCategory,
        idOfShop,
        productDescription,
        productDetails,
        price,
        countInStock,
        isBestSeller,
        cateName,
        status: 'active',
        weight,
        dimension,
        rating: 0,
        isOnlineProduct,
        isKiotProduct,
        createdAt: time,
        updatedAt: time,
        createdBy: `shop-${idOfShop}`,
        updatedBy: `shop-${idOfShop}`,
      });

      const data = await this.productRepository.create(product);
      return data;
    } else {
      const time = new Date().toLocaleString();
      const product = new Product({
        name,
        image: {
          url: imageData.url,
          filename: imageData.filename,
        },
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
        status: 'active',
        weight,
        dimension,
        rating: 0,
        createdAt: time,
        updatedAt: time,
        createdBy: `shop-${idOfShop}`,
        updatedBy: `shop-${idOfShop}`,
      });
      const data = await this.productRepository.create(product);
      return data;
    }
  }

  @get('/products/count')
  @response(200, {
    description: 'Product model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Product) where?: Where<Product>): Promise<Count> {
    return this.productRepository.count(where);
  }

  @get('/products')
  @response(200, {
    description: 'Array of Product model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Product, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Product) filter?: Filter<Product>,
  ): Promise<Product[]> {
    return this.productRepository.find(filter);
  }

  @get('/products/{id}')
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
  ): Promise<Product> {
    return this.productRepository.findById(id, filter);
  }

  @patch('/products/shop/{idOfShop}/category/{idOfCategory}/{id}')
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
      status,
      isKiotProduct,
      isOnlineProduct,
      idOfKiot,
    } = data.body;

    const category = await this.categoryRepository.findById(idOfCategory);
    const oldImage: any = (await this.productRepository.findById(id)).image;

    if (!category) {
      return response.status(400).send('Category not found');
    }

    const cateName = category.cateName;

    if (data.files == null) {
      const imageData: any = await uploadFile(data.files.image[0]);
      const time = new Date().toLocaleString();
      const product = new Product({
        name,
        image: {
          url: imageData.url,
          filename: imageData.filename,
        },
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
        status,
        weight,
        dimension,
        updatedAt: time,
        updatedBy: `shop-${idOfShop}`,
      });

      await this.productRepository.updateById(id, product);

      if (oldImage) {
        await deleteRemoteFile(oldImage.filename);
      }
    } else {
      const time = new Date().toLocaleString();
      const product = new Product({
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
        status,
        weight,
        dimension,
        updatedAt: time,
        updatedBy: `shop-${idOfShop}`,
      });

      await this.productRepository.updateById(id, product);
    }

    return this.productRepository.findById(id);
  }

  @del('/products/{id}')
  @response(204, {
    description: 'Product DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.productRepository.deleteById(id);
  }
}
