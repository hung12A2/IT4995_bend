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
  del,
  requestBody,
  response,
  RestBindings,
  Response,
  Request,
} from '@loopback/rest';
import {inject} from '@loopback/core';
import multer from 'multer';
import FormData from 'form-data';
import storeAxios from '../services/storeAxios.service';

const storage = multer.memoryStorage();
const upload = multer({storage});

var cpUpload = upload.fields([{name: 'image'}]);

export class CategoryController {
  constructor() {}

  @post('/categories')
  @response(200, {
    description: 'Category model instance',
    content: {
      'application/json': {
        schema: {
          type: 'object',
        },
      },
    },
  })
  async create(
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

    let formData = new FormData();

    formData.append('image', data.files.image[0].buffer, {
      contentType: data.files.image[0].mimetype,
      filename: data.files.image[0].originalname,
    });
    formData.append('cateName', data.body.cateName);
    formData.append('description', data.body.description);
    const dataReturn = await storeAxios.post(`/categories`, formData, {
      headers: {
        Authorization: request.headers.authorization,
        "Content-Type": `multipart/form-data; boundary=${formData.getBoundary()}`,
      },
    });

    return dataReturn;
  }

  @get('/categories')
  @response(200, {
    description: 'Array of Category model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: {
            type: 'object',
          },
        },
      },
    },
  })
  async find(@param.query.object(`filter`) filter: string): Promise<any> {
    const data = await storeAxios.get(`categories`, {
      params: {
        filter,
      },
    });

    return data
  }

  @get('/categories/count')
  @response(200, {
    description: 'Array of Category model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: {
            type: 'object',
          },
        },
      },
    },
  })
  async count(@param.query.object(`filter`) filter: string): Promise<any> {
    const data = await storeAxios.get(`categories/count`, {
      params: {
        filter,
      },
    });

    return data
  }


  @get('/categories/{id}')
  @response(200, {
    description: 'Category model instance',
    content: {
      'application/json': {
        schema: {
          type: 'object',
        },
      },
    },
  })
  async findById(@param.path.string('id') id: string): Promise<any> {
    const data = await storeAxios.get(`/categories/${id}`);
    return data;
  }

  @patch('/categories/{id}')
  @response(204, {
    description: 'Category PATCH success',
  })
  async updateById(
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

    let formData = new FormData();

    formData.append('image', data.files.image[0].buffer, {
      contentType: data.files.image[0].mimetype,
      filename: data.files.image[0].originalname,
    });
    formData.append('cateName', data.body.cateName);
    formData.append('description', data.body.description);
    const dataReturn = await storeAxios.patch(`/categories/${id}`, formData, {
      headers: {
        Authorization: request.headers.authorization,
        "Content-Type": `multipart/form-data; boundary=${formData.getBoundary()}`,
      },
    });

    return dataReturn;
  }
}
