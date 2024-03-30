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
  Request,
  RestBindings,
  Response,
} from '@loopback/rest';
import {RequestCreateShop, Store} from '../models';
import {RequestCreateShopRepository, StoreRepository} from '../repositories';
import {inject} from '@loopback/core';
import multer from 'multer';
import {uploadFile} from '../config/firebaseConfig';
import {UserRepository} from '@loopback/authentication-jwt';
import {SecurityBindings, UserProfile} from '@loopback/security';
import {authenticate} from '@loopback/authentication';

// upload
const storage = multer.memoryStorage();
const upload = multer({storage});

var cpUpload = upload.fields([{name: 'IDcardImg'}, {name: 'BLicenseImg'}]);
// upload img

export class RedCreateShopController {
  constructor(
    @repository(RequestCreateShopRepository)
    public requestCreateShopRepository: RequestCreateShopRepository,
    @repository(StoreRepository)
    public storeRepository: StoreRepository,
    @repository(UserRepository)
    public userRepository: UserRepository,
  ) {}

  @authenticate('jwt')
  @post('/request-create-shops')
  @response(200, {
    description: 'RequestCreateShop model instance',
    content: {
      'application/json': {schema: getModelSchemaRef(RequestCreateShop)},
    },
  })
  async create(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
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
    const idOfUser = currentUserProfile.id;
    const requestCreate = await this.requestCreateShopRepository.find({
      where: {idOfUser: idOfUser},
    });
    const Store = await this.storeRepository.find({
      where: {idOfUser: idOfUser},
    });

    if (requestCreate.length > 0 && requestCreate[0].status == 'pending') {
      return response
        .status(200)
        .send({messsage: 'Dang xu ly yeu cau tao shop '});
    }

    if (Store.length > 0) {
      return response.status(200).send({messsage: 'khong the tao 2 shop'});
    }

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

    const {pickUpAddress, returnAddress, phoneNumber, email, name} = data.body;

    const filesIDcardImg: any[] = data.files.IDcardImg;

    const IDcardImg = await Promise.all(
      filesIDcardImg.map(async file => {
        const data: any = await uploadFile(file);

        const IDcardImg = Object.assign({
          filename: data.filename,
          url: data.url,
        });

        return IDcardImg;
      }),
    );

    const filesBLicenseImg: any[] = data.files.BLicenseImg;
    const BLicenseImg = await Promise.all(
      filesBLicenseImg.map(async file => {
        const data: any = await uploadFile(file);

        const IDcardImg = {
          filename: data.filename,
          url: data.url,
        };

        return IDcardImg;
      }),
    );

    const requestCreateShopData: RequestCreateShop = Object.assign({
      idOfUser: idOfUser,
      status: 'pending',
      pickUpAddress,
      returnAddress,
      phoneNumber,
      email,
      name,
      IDcardImg: IDcardImg,
      BLicenseImg: BLicenseImg,
    });

    return this.requestCreateShopRepository.create(requestCreateShopData);
  }

  @post('/request-create-shops/accepted/{id}')
  @response(200, {
    description: 'RequestCreateShop model instance',
    content: {
      'application/json': {schema: getModelSchemaRef(RequestCreateShop)},
    },
  })
  async acceptRequestCreateShop(
    @inject(RestBindings.Http.RESPONSE) response: Response,
    @param.path.string('id') idOfRequest: string,
  ): Promise<any> {
    const requestCreatShopData =
      await this.requestCreateShopRepository.findById(idOfRequest);
    const {
      idOfUser,
      pickUpAddress,
      returnAddress,
      IDcardImg,
      BLicenseImg,
      phoneNumber,
      email,
      name,
    } = requestCreatShopData;

    const storeData: Store = Object.assign({
      idOfUser,
      coverImage: {filename: '', url: ''},
      avartar: {filename: '', url: ''},
      description: 'no desc',
      permissions: 'all permissions',
      numberOfProducts: 0,
      avgRating: 0,
      IDcardImg,
      BLicenseImg,
      pickUpAddress,
      returnAddress,
      phoneNumber,
      email,
      name,
    });
    await this.requestCreateShopRepository.updateById(idOfRequest, {
      status: 'aceepted',
    });
    await this.userRepository.updateById(idOfUser, {isSeller: true});
    return this.storeRepository.create(storeData);
  }

  @post('/request-create-shops/reject/{id}')
  @response(200, {
    description: 'RequestCreateShop model instance',
    content: {
      'application/json': {schema: getModelSchemaRef(RequestCreateShop)},
    },
  })
  async rejectRequestCreateShop(
    @inject(RestBindings.Http.RESPONSE) response: Response,
    @param.path.string('id') idOfRequest: string,
  ): Promise<any> {
    await this.requestCreateShopRepository.updateById(idOfRequest, {
      status: 'rejected',
    });
  }

  @get('/request-create-shops/count')
  @response(200, {
    description: 'RequestCreateShop model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(RequestCreateShop) where?: Where<RequestCreateShop>,
  ): Promise<Count> {
    return this.requestCreateShopRepository.count(where);
  }

  @get('/request-create-shops')
  @response(200, {
    description: 'Array of RequestCreateShop model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(RequestCreateShop, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(RequestCreateShop) filter?: Filter<RequestCreateShop>,
  ): Promise<RequestCreateShop[]> {
    return this.requestCreateShopRepository.find(filter);
  }

  @get('/request-create-shops/{id}')
  @response(200, {
    description: 'RequestCreateShop model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(RequestCreateShop, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(RequestCreateShop, {exclude: 'where'})
    filter?: FilterExcludingWhere<RequestCreateShop>,
  ): Promise<RequestCreateShop> {
    return this.requestCreateShopRepository.findById(id, filter);
  }

  @patch('/request-create-shops/{id}')
  @response(204, {
    description: 'RequestCreateShop PATCH success',
  })
  async updateById(
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
    @param.path.string('id') id: string,
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

    const {pickUpAddress, returnAddress, phoneNumber, email, name} = data.body;

    const filesIDcardImg: any[] = data.files.IDcardImg
      ? data.files.IDcardImg
      : [];

    const IDcardImg = await Promise.all(
      filesIDcardImg.map(async file => {
        const data: any = await uploadFile(file);

        const IDcardImg = Object.assign({
          filename: data.filename,
          url: data.url,
        });

        return IDcardImg;
      }),
    );

    const filesBLicenseImg: any[] = data.files.BLicenseImg
      ? data.files.BLicenseImg
      : [];
    const BLicenseImg = await Promise.all(
      filesBLicenseImg.map(async file => {
        const data: any = await uploadFile(file);

        const IDcardImg = {
          filename: data.filename,
          url: data.url,
        };

        return IDcardImg;
      }),
    );

    const requestCreateShopData: RequestCreateShop = Object.assign({
      idOfUser: '1',
      status: 'pending',
      pickUpAddress,
      returnAddress,
      phoneNumber,
      email,
      name,
      IDcardImg,
      BLicenseImg,
    });

    await this.requestCreateShopRepository.updateById(
      id,
      requestCreateShopData,
    );

    return this.requestCreateShopRepository.findById(id);
  }

  @del('/request-create-shops/{id}')
  @response(204, {
    description: 'RequestCreateShop DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.requestCreateShopRepository.updateById(id, {status: 'deleted'});
  }
}
