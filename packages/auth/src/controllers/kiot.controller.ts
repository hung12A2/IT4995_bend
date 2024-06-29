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
} from '@loopback/rest';
import {Kiot} from '../models';
import {
  AreaRepository,
  EmployeeRepository,
  KiotRepository,
  StoreRepository,
} from '../repositories';
import {inject} from '@loopback/core';
import {UserRepository} from '@loopback/authentication-jwt';
import {geometry} from '../utils/getGeometry';
import {authenticate} from '@loopback/authentication';
import {SecurityBindings, UserProfile} from '@loopback/security';
import {authorize} from '@loopback/authorization';
import {basicAuthorization} from '../services/basicAuthorize';
import GeoPoint from 'geopoint';

export class KiotController {
  constructor(
    @repository(KiotRepository)
    public kiotRepository: KiotRepository,
    @repository(StoreRepository)
    public shopRepository: StoreRepository,
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(EmployeeRepository)
    public employeeRepository: EmployeeRepository,
    @repository(AreaRepository)
    public areaRepository: AreaRepository,
  ) {}

  @authenticate('jwt')
  @authorize({voters: [basicAuthorization], allowedRoles: ['customer']})
  @post('/kiots/area/{idOfArea}')
  @response(200, {
    description: 'Kiot model instance',
    content: {'application/json': {schema: getModelSchemaRef(Kiot)}},
  })
  async create(
    @inject(SecurityBindings.USER)
    currentUser: UserProfile,
    @inject(RestBindings.Http.RESPONSE) response: Response,
    @param.path.string('idOfArea') idOfArea: string,
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              name: {type: 'string'},
              description: {type: 'string'},
              returnAddress: {type: 'string'},
              pickUpAddress: {type: 'string'},
              pickUpProvince: {type: 'string'},
              returnProvince: {type: 'string'},
              pickUpDistrict: {type: 'string'},
              returnDistrict: {type: 'string'},
              pickUpWard: {type: 'string'},
              returnWard: {type: 'string'},
              phoneNumber: {type: 'string'},
              email: {type: 'string'},
            },
          },
        },
      },
    })
    kiot: any,
  ): Promise<any> {
    const idOfUser = currentUser.id;

    const checkArea = await this.areaRepository.findOne({
      where: {id: idOfArea},
    });
    if (!checkArea) {
      return {
        code: 400,
        message: 'Area not found',
      };
    }

    if (!idOfArea || !idOfUser) {
      return {
        code: 400,
        message: 'Missing idOfArea or idOfUser',
      };
    }

    const {
      name,
      description,
      pickUpAddress,
      returnAddress,
      pickUpProvince,
      returnProvince,
      pickUpDistrict,
      returnDistrict,
      pickUpWard,
      returnWard,
      phoneNumber,
      email,
    } = kiot;

    const shop: any = await this.shopRepository.findOne({where: {idOfUser}});

    const checkKiot = await this.kiotRepository.findOne({where: {idOfUser}});

    if (checkKiot) {
      return {
        code: 400,
        message: 'Kiot already exists',
      };
    }

    if (!shop) {
      return {
        code: 400,
        message: 'Shop not found',
      };
    }

    const pickUpProvinceName = pickUpProvince.split('-')[0].trim();
    const pickUpProvinceId = pickUpProvince.split('-')[1].trim();
    const pickUpDistrictName = pickUpDistrict.split('-')[0].trim();
    const pickUpDistrictId = pickUpDistrict.split('-')[1].trim();
    const pickUpWardName = pickUpWard.split('-')[0].trim();
    const pickUpWardId = pickUpWard.split('-')[1].trim();

    const returnProvinceName = returnProvince.split('-')[0].trim();
    const returnProvinceId = returnProvince.split('-')[1].trim();
    const returnDistrictName = returnDistrict.split('-')[0].trim();
    const returnDistrictId = returnDistrict.split('-')[1].trim();
    const returnWardName = returnWard.split('-')[0].trim();
    const returnWardId = returnWard.split('-')[1].trim();

    const createTime = new Date().toLocaleString();
    const createdAt = createTime;
    const updatedAt = createTime;
    const createdBy = `user - ${idOfUser}`;
    const updatedBy = `user - ${idOfUser}`;

    const pickUpGeometryName = `${pickUpAddress},${pickUpWardName}, ${pickUpDistrictName}, ${pickUpProvinceName}`;
    const returnGeometryName = `${returnAddress},${returnWardName}, ${returnDistrictName}, ${returnProvinceName}`;

    const pickUpGeometryData: any = await geometry(pickUpGeometryName);
    if (pickUpGeometryData.status !== 'OK') {
      return {code: 400, message: 'Loi he thong'};
    }
    const pickUpGeometry = pickUpGeometryData.results[0].geometry.location;

    const returnGeometryData: any = await geometry(returnGeometryName);
    if (returnGeometryData.status !== 'OK') {
      return {code: 400, message: 'Loi he thong'};
    }
    const returnGeometry = returnGeometryData.results[0].geometry.location;

    const newKiot = {
      idOfArea,
      idOfUser,
      idOfShop: shop.id,
      pickUpAddress,
      returnAddress,
      pickUpProvinceName,
      pickUpProvinceId,
      returnProvinceName,
      returnProvinceId,
      pickUpDistrictName,
      pickUpDistrictId,
      returnDistrictName,
      returnDistrictId,
      pickUpWardName,
      pickUpWardId,
      returnWardName,
      returnWardId,
      name,
      description,
      createdAt,
      updatedAt,
      createdBy,
      updatedBy,
      coverImage: shop.coverImage,
      avatar: shop.avatar,
      BLicenseImg: shop.BLicenseImg,
      IDcardImg: shop.IDcardImg,
      phoneNumber,
      email,
      pickUpGeometry,
      returnGeometry,
      status: 'active',
    };

    const dataKiot = await this.kiotRepository.create(newKiot);

    this.userRepository.updateById(idOfUser, {idOfKiot: dataKiot.id});

    this.employeeRepository.updateAll(
      {idOfShop: shop.id},
      {idOfKiot: dataKiot.id},
    );

    return dataKiot;
  }

  @get('/kiots')
  @response(200, {
    description: 'Array of Kiot model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Kiot, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(Kiot) filter?: any): Promise<any> {
    if (filter?.where?.pickUpGeometry) {
      let near: any = filter?.where.pickUpGeometry.near;

      near = {
        lat: +near.lat,
        lng: +near.lng,
      };

      let maxDistance = filter?.where.pickUpGeometry.maxDistance;
      let unit = filter?.where.pickUpGeometry.unit;
      let pickUpGeometry = {
        near,
        maxDistance: +maxDistance,
        unit,
      };
      filter.where.pickUpGeometry = pickUpGeometry;
      filter.where.pickUpGeometry = pickUpGeometry;
    }

    const data = await this.kiotRepository.find(filter);
    return data;
  }

  @get('/kiots/count')
  @response(200, {
    description: 'Array of Kiot model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Kiot, {includeRelations: true}),
        },
      },
    },
  })
  async count(@param.filter(Kiot) filter?: Filter<Kiot>): Promise<any> {
    const data = await this.kiotRepository.count(filter);
    return data;
  }

  @get('/kiots/{id}')
  @response(200, {
    description: 'Kiot model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Kiot, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Kiot, {exclude: 'where'}) filter?: FilterExcludingWhere<Kiot>,
  ): Promise<Kiot> {
    return this.kiotRepository.findById(id, filter);
  }

  @post('/kiots/banned/{id}')
  @response(200, {
    description: 'Array of Kiot model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Kiot, {includeRelations: true}),
        },
      },
    },
  })
  async Ban(@param.path.string('id') id: string): Promise<any> {
    await this.kiotRepository.updateById(id, {status: 'banned'});
    return {
      code: 200,
      message: 'Banned successfully',
    };
  }

  @post('/kiots/unbanned/{id}')
  @response(200, {
    description: 'Array of Kiot model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Kiot, {includeRelations: true}),
        },
      },
    },
  })
  async unban(@param.path.string('id') id: string): Promise<any> {
    await this.kiotRepository.updateById(id, {status: 'active'});
    return {
      code: 200,
      message: 'Unbanned successfully',
    };
  }

  @authenticate('jwt')
  @authorize({voters: [basicAuthorization], allowedRoles: ['customer']})
  @patch('/kiots/area/{idOfArea}')
  @response(204, {
    description: 'Kiot PATCH success',
  })
  async updateById(
    @inject(SecurityBindings.USER)
    currentUser: UserProfile,
    @inject(RestBindings.Http.RESPONSE) response: Response,
    @param.path.string('idOfArea') idOfArea: string,
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
          },
        },
      },
    })
    kiot: any,
  ): Promise<any> {
    const idOfUser = currentUser.id;

    const {
      name,
      description,
      pickUpAddress,
      returnAddress,
      pickUpProvince,
      returnProvince,
      pickUpDistrict,
      returnDistrict,
      pickUpWard,
      returnWard,
      phoneNumber,
      email,
    } = kiot;

    const shop: any = await this.shopRepository.findOne({where: {idOfUser}});

    const checkKiot: any = await this.kiotRepository.findOne({
      where: {idOfUser},
    });

    if (!checkKiot) {
      return {
        code: 400,
        message: 'Kiot not found',
      };
    }

    if (!shop) {
      return {
        code: 400,
        message: 'Shop not found',
      };
    }

    const pickUpProvinceName = pickUpProvince.split('-')[0].trim();
    const pickUpProvinceId = pickUpProvince.split('-')[1].trim();
    const pickUpDistrictName = pickUpDistrict.split('-')[0].trim();
    const pickUpDistrictId = pickUpDistrict.split('-')[1].trim();
    const pickUpWardName = pickUpWard.split('-')[0].trim();
    const pickUpWardId = pickUpWard.split('-')[1].trim();

    const returnProvinceName = returnProvince.split('-')[0].trim();
    const returnProvinceId = returnProvince.split('-')[1].trim();
    const returnDistrictName = returnDistrict.split('-')[0].trim();
    const returnDistrictId = returnDistrict.split('-')[1].trim();
    const returnWardName = returnWard.split('-')[0].trim();
    const returnWardId = returnWard.split('-')[1].trim();

    const createTime = new Date().toLocaleString();
    const updatedAt = createTime;
    const updatedBy = `shopOwner${idOfUser}`;

    const pickUpGeometryName = `${pickUpAddress},${pickUpWardName}, ${pickUpDistrictName}, ${pickUpProvinceName}`;
    const returnGeometryName = `${returnAddress},${returnWardName}, ${returnDistrictName}, ${returnProvinceName}`;

    const pickUpGeometryData: any = await geometry(pickUpGeometryName);
    if (pickUpGeometryData.status !== 'OK') {
      return {code: 400, message: 'Loi he thong'};
    }
    const pickUpGeometry = pickUpGeometryData.results[0].geometry.location;

    const returnGeometryData: any = await geometry(returnGeometryName);
    if (returnGeometryData.status !== 'OK') {
      return {code: 400, message: 'Loi he thong'};
    }
    const returnGeometry = returnGeometryData.results[0].geometry.location;

    const newKiot = {
      pickUpGeometry,
      returnGeometry,
      idOfArea,
      idOfUser,
      idOfShop: shop.id,
      pickUpAddress,
      returnAddress,
      pickUpProvinceName,
      pickUpProvinceId,
      returnProvinceName,
      returnProvinceId,
      pickUpDistrictName,
      pickUpDistrictId,
      returnDistrictName,
      returnDistrictId,
      pickUpWardName,
      pickUpWardId,
      returnWardName,
      returnWardId,
      name,
      description,
      updatedAt,
      updatedBy,
      phoneNumber,
      email,
    };

    await this.kiotRepository.updateById(checkKiot.id, newKiot);

    return this.kiotRepository, this.findById(checkKiot.id);
  }

  @get('/searchesKiot/{keyWord}')
  @response(200, {
    description: 'Array of Search model instances',
    content: {
      'application/json': {
        schema: {
          type: 'object',
        },
      },
    },
  })
  async findKiotByKey(
    @param.path.string('keyWord') keyWord: string,
    @param.query.object('filter') filter?: any,
  ): Promise<any> {

    if (keyWord === 'all') { 
      keyWord = '';
    }
    
    if (filter?.where.pickUpGeometry) {
      let near: any = filter?.where.pickUpGeometry.near;

      near = {
        lat: +near.lat,
        lng: +near.lng,
      };

      let maxDistance = filter?.where.pickUpGeometry.maxDistance;
      let unit = filter?.where.pickUpGeometry.unit;
      let pickUpGeometry = {
        near,
        maxDistance: +maxDistance,
        unit,
      };
      filter.where.pickUpGeometry = pickUpGeometry;
      filter.where.pickUpGeometry = pickUpGeometry;
    }

    let productsReturn = [];

    let products = await this.kiotRepository.find(filter);

    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      let name = normalizeString(product.name.trim().toLowerCase());
      let keyWordNormalize = normalizeString(keyWord.trim().toLowerCase());
      let description = normalizeString(
        product.description.trim().toLowerCase(),
      );

      if (
        name.includes(keyWordNormalize) ||
        description.includes(keyWordNormalize)
      ) {
        productsReturn.push(product);
      }
    }

    return productsReturn;
  }
}

function normalizeString(str: string): string {
  const accentsMap: any = {
    á: 'a',
    à: 'a',
    ả: 'a',
    ã: 'a',
    ạ: 'a',
    ă: 'a',
    ắ: 'a',
    ằ: 'a',
    ẳ: 'a',
    ẵ: 'a',
    ặ: 'a',
    â: 'a',
    ấ: 'a',
    ầ: 'a',
    ẩ: 'a',
    ẫ: 'a',
    ậ: 'a',
    é: 'e',
    è: 'e',
    ẻ: 'e',
    ẽ: 'e',
    ẹ: 'e',
    ê: 'e',
    ế: 'e',
    ề: 'e',
    ể: 'e',
    ễ: 'e',
    ệ: 'e',
    í: 'i',
    ì: 'i',
    ỉ: 'i',
    ĩ: 'i',
    ị: 'i',
    ó: 'o',
    ò: 'o',
    ỏ: 'o',
    õ: 'o',
    ọ: 'o',
    ô: 'o',
    ố: 'o',
    ồ: 'o',
    ổ: 'o',
    ỗ: 'o',
    ộ: 'o',
    ơ: 'o',
    ớ: 'o',
    ờ: 'o',
    ở: 'o',
    ỡ: 'o',
    ợ: 'o',
    ú: 'u',
    ù: 'u',
    ủ: 'u',
    ũ: 'u',
    ụ: 'u',
    ư: 'u',
    ứ: 'u',
    ừ: 'u',
    ử: 'u',
    ữ: 'u',
    ự: 'u',
    ý: 'y',
    ỳ: 'y',
    ỷ: 'y',
    ỹ: 'y',
    ỵ: 'y',
    đ: 'd',
  };

  return str
    .split('')
    .map(char => accentsMap[char] || char)
    .join('')
    .replace(/\s+/g, '');
}
