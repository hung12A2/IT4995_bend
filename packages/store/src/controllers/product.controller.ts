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
import {
  CategoryRepository,
  KiotInfoRepository,
  ProductRepository,
} from '../repositories';

import {uploadFile, deleteRemoteFile} from '../config/firebaseConfig';
import multer from 'multer';
import {inject} from '@loopback/core';

const storage = multer.memoryStorage();
const upload = multer({storage});

var cpUpload = upload.fields([{name: 'images'}]);

export class ProductController {
  constructor(
    @repository(ProductRepository)
    public productRepository: ProductRepository,
    @repository(CategoryRepository)
    public categoryRepository: CategoryRepository,
    @repository(KiotInfoRepository)
    public kiotInfoRepository: KiotInfoRepository,
  ) {}

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
  async find(@param.filter(Product) filter?: Filter<Product>): Promise<any> {
    const data = await this.productRepository.find(filter);
    return data;
  }

  @get('/products/count')
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
  async count(@param.filter(Product) filter?: Filter<Product>): Promise<any> {
    const data = await this.productRepository.count(filter);
    return data;
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

  @post('/products/banned/{id}')
  @response(200, {
    description: 'Product model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Product, {includeRelations: true}),
      },
    },
  })
  async BannedById(@param.path.string('id') id: string): Promise<any> {
    await this.productRepository.updateById(id, {status: 'banned'});
    return {
      code: 200,
      message: 'Banned success',
    };
  }

  @post('/products/unbanned/{id}')
  @response(200, {
    description: 'Product model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Product, {includeRelations: true}),
      },
    },
  })
  async unbannedById(@param.path.string('id') id: string): Promise<any> {
    await this.productRepository.updateById(id, {status: 'active'});
    return {
      code: 200,
      message: 'unbanned success',
    };
  }

  @post('/products/inActive/{id}')
  @response(200, {
    description: 'Product model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Product, {includeRelations: true}),
      },
    },
  })
  async inActiveById(@param.path.string('id') id: string): Promise<any> {
    await this.productRepository.updateById(id, {status: 'inActive'});
    return {
      code: 200,
      message: 'inActive success',
    };
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

    let {
      price,
      productDetails,
      countInStock,
      isBestSeller,
      weight,
      dimension,
      isKiotProduct,
      isOnlineProduct,
      idOfKiot,
      oldImages,
    } = data.body;

    oldImages = oldImages ? oldImages : [];

    if (!Array.isArray(oldImages)) {
      oldImages = [oldImages];
    }

    if (oldImages) {
      oldImages = oldImages.map((img: any) => {
        img = JSON.parse(img);
        return {
          url: img.url,
          filename: img.filename,
        };
      });
    }

    if (!idOfKiot && isKiotProduct) {
      return {
        code: 400,
        message: 'Missing idOfKiot',
      };
    }

    const category = await this.categoryRepository.findById(idOfCategory);
    let oldProduct: any = await this.productRepository.findById(id);

    let oldIsKiotProduct = oldProduct?.isKiotProduct;

    if (oldIsKiotProduct && !isKiotProduct) {
      const oldKiotInfo = await this.kiotInfoRepository.findOne({
        where: {
          idOfShop,
          idOfKiot: oldProduct.idOfKiot,
        },
      });

      if (oldKiotInfo) {
        await this.kiotInfoRepository.updateById(oldKiotInfo.id, {
          numberOfProduct: oldKiotInfo.numberOfProduct - 1,
        });
      }
    }

    if (!oldIsKiotProduct && isKiotProduct) {
      const oldKiotInfo = await this.kiotInfoRepository.findOne({
        where: {
          idOfShop,
          idOfKiot: oldProduct.idOfKiot,
        },
      });

      if (oldKiotInfo) {
        await this.kiotInfoRepository.updateById(oldKiotInfo.id, {
          numberOfProduct: oldKiotInfo.numberOfProduct + 1,
        });
      }
    }

    let oldImage = oldProduct?.image;

    oldImage = oldImage ? oldImage : [];

    if (!category) {
      return {
        code: 400,
        message: 'Category not found',
      };
    }

    const cateName = category.cateName;

    if (data.files.images?.length > 0) {
      let image = await Promise.all(
        data.files.images.map(async (image: any) => {
          const dataImg: any = await uploadFile(image);
          return {
            url: dataImg.url,
            filename: dataImg.filename,
          };
        }),
      );

      image = [...image, ...oldImages];

      const time = new Date().toLocaleString();
      let product: any = {
        image,
        idOfCategory,
        idOfShop,
        isKiotProduct,
        isOnlineProduct,
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

      await this.productRepository.updateById(id, product);

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
        idOfCategory,
        idOfShop,
        isKiotProduct,
        isOnlineProduct,
        idOfKiot: isKiotProduct ? idOfKiot : null,
        productDetails,
        price,
        countInStock,
        isBestSeller,
        cateName,
        weight,
        dimension,
        updatedAt: time,
        updatedBy: `shop-${idOfShop}`,
        image: oldImages,
      };
      if (idOfKiot) product.idOfKiot = idOfKiot;

      await this.productRepository.updateById(id, product);
    }

    const dataReturn = await this.productRepository.findById(id);

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
    await this.productRepository.deleteById(id);
  }
}
