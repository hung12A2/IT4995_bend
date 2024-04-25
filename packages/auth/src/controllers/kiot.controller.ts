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
  EmployeeRepository,
  KiotRepository,
  StoreRepository,
} from '../repositories';
import {inject} from '@loopback/core';
import {UserRepository} from '@loopback/authentication-jwt';

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
  ) {}

  @post('/kiots/user/{idOfUser}/area/{idOfArea}')
  @response(200, {
    description: 'Kiot model instance',
    content: {'application/json': {schema: getModelSchemaRef(Kiot)}},
  })
  async create(
    @inject(RestBindings.Http.RESPONSE) response: Response,
    @param.path.string('idOfUser') idOfUser: string,
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
      return response.status(400).send({message: 'Kiot already exists'});
    }

    if (!shop) {
      return response.status(400).send({message: 'Shop not found'});
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
    const createdBy = `shopOwner${idOfUser}`;
    const updatedBy = `shopOwner${idOfUser}`;

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
  async find(@param.filter(Kiot) filter?: Filter<Kiot>): Promise<Kiot[]> {
    return this.kiotRepository.find(filter);
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

  @patch('/kiots/user/{idOfUser}')
  @response(204, {
    description: 'Kiot PATCH success',
  })
  async updateById(
    @inject(RestBindings.Http.RESPONSE) response: Response,
    @param.path.string('idOfUser') idOfUser: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Kiot, {partial: true}),
        },
      },
    })
    kiot: Kiot,
  ): Promise<any> {
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
      idOfArea,
    } = kiot;

    const shop: any = await this.shopRepository.findOne({where: {idOfUser}});

    const checkKiot: any = await this.kiotRepository.findOne({
      where: {idOfUser},
    });

    if (!checkKiot) {
      return response.status(400).send({message: 'Kiot not found'});
    }

    if (!shop) {
      return response.status(400).send({message: 'Shop not found'});
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
      updatedAt,
      updatedBy,
      phoneNumber,
      email,
    };

    await this.kiotRepository.updateById(checkKiot.id, newKiot);

    return this.kiotRepository, this.findById(checkKiot.id);
  }
}
