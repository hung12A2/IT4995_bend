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
import {LocationUser} from '../models';
import {LocationUserRepository} from '../repositories';
import {geometry} from '../utils/getGeometry';

export class LocationUserController {
  constructor(
    @repository(LocationUserRepository)
    public locationUserRepository: LocationUserRepository,
  ) {}

  //

  @post('/location-users/{idOfUser}')
  @response(200, {
    description: 'LocationUser model instance',
    content: {'application/json': {schema: getModelSchemaRef(LocationUser)}},
  })
  async create(
    @param.path.string('idOfUser') idOfUser: string,
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              address: {type: 'string'},
              isDefaultOnline: {type: 'boolean'},
              isDefaultKiot: {type: 'boolean'},
              province: {type: 'string'},
              district: {type: 'string'},
              ward: {type: 'string'},
              phoneNumber: {type: 'string'},
              name: {type: 'string'}
            },
          },
        },
      },
    })
    locationUser: any,
  ): Promise<any> {
    const {
      address,
      isDefaultOnline,
      isDefaultKiot,
      province,
      district,
      ward,
      phoneNumber,
      name
    } = locationUser;

    if (!address || !province || !district || !ward) {
      return {
        code: 400,
        message: 'Missing required fields',
      };
    }

    const provinceName = province.split('-')[0];
    const provinceId = province.split('-')[1];
    const districtName = district.split('-')[0];
    const districtId = district.split('-')[1];
    const wardName = ward.split('-')[0];
    const wardId = ward.split('-')[1];

    const geometryData = await geometry(
      `${address}, ${wardName}, ${districtName}, ${provinceName}`,
    );

    if (geometryData.status !== 'OK') {
      return {code: 400, message: 'Loi he thong khi lay toa do'};
    }

    if (isDefaultOnline) {
      await this.locationUserRepository.updateAll(
        {isDefaultOnline: false},
        {idOfUser},
      );
    }

    if (isDefaultKiot) {
      await this.locationUserRepository.updateAll(
        {isDefaultKiot: false},
        {idOfUser},
      );
    }

    const newLocation = {
      address,
      isDefaultOnline,
      isDefaultKiot,
      provinceName,
      provinceId,
      districtName,
      districtId,
      wardName,
      wardId,
      idOfUser,
      phoneNumber,
      geometry: geometryData.results[0].geometry.location,
      name
    };

    const data = await this.locationUserRepository.create(newLocation);

    return {code: 200, data};
  }

  @patch('/location-users/{idOfUser}/location-id/{id}')
  @response(200, {
    description: 'LocationUser model instance',
    content: {'application/json': {schema: getModelSchemaRef(LocationUser)}},
  })
  async updateLocation(
    @param.path.string('idOfUser') idOfUser: string,
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              address: {type: 'string'},
              isDefaultOnline: {type: 'boolean'},
              isDefaultKiot: {type: 'boolean'},
              province: {type: 'string'},
              district: {type: 'string'},
              ward: {type: 'string'},
              phoneNumber: {type: 'string'},
              name: {type: 'string'}
            },
          },
        },
      },
    })
    locationUser: any,
  ): Promise<any> {
    const oldLocation: any = await this.locationUserRepository.findOne({
      where: {idOfUser, id},
    });

    const {
      address,
      isDefaultOnline,
      isDefaultKiot,
      province,
      district,
      ward,
      phoneNumber,
      name
    } = locationUser;

    if (!oldLocation) {
      return {
        code: 400,
        message: 'Location not found',
      };
    }

    if (oldLocation.isDefaultOnline == true && isDefaultOnline == false) {
      return {
        code: 400,
        message: 'Khong the bo chon mac dinh online',
      };
    }

    if (oldLocation.isDefaultOnline == false && isDefaultOnline == true) {
      await this.locationUserRepository.updateAll(
        {isDefaultOnline: false},
        {idOfUser},
      );
    }

    if (oldLocation.isDefaultKiot == true && isDefaultKiot == false) {
      return {
        code: 400,
        message: 'Khong the bo chon mac dinh kiot',
      };
    }

    if (oldLocation.isDefaultKiot == false && isDefaultKiot == true) {
      await this.locationUserRepository.updateAll(
        {isDefaultKiot: false},
        {idOfUser},
      );
    }

    if (!address || !province || !district || !ward) {
      return {
        code: 400,
        message: 'Missing required fields',
      };
    }

    const provinceName = province.split('-')[0];
    const provinceId = province.split('-')[1];
    const districtName = district.split('-')[0];
    const districtId = district.split('-')[1];
    const wardName = ward.split('-')[0];
    const wardId = ward.split('-')[1];

    if (
      oldLocation.provinceName !== provinceName ||
      oldLocation.districtName !== districtName ||
      oldLocation.wardName !== wardName
    ) {
      const geometryData = await geometry(
        `${address}, ${wardName}, ${districtName}, ${provinceName}`,
      );

      if (geometryData.status !== 'OK') {
        return {code: 400, message: 'Loi he thong khi lay toa do'};
      }

      const newLocation = {
        address,
        isDefaultOnline,
        isDefaultKiot,
        provinceName,
        provinceId,
        districtName,
        districtId,
        wardName,
        wardId,
        idOfUser,
        name,
        geometry: geometryData.results[0].geometry.location,
      };

      const data = await this.locationUserRepository.updateById(
        id,
        newLocation,
      );
      return {code: 200, data: await this.locationUserRepository.findById(id)};
    } else {
      const newLocation = {
        address,
        isDefaultOnline,
        isDefaultKiot,
        provinceName,
        provinceId,
        districtName,
        districtId,
        wardName,
        wardId,
        idOfUser,
        phoneNumber,
        name
      };

      const data = await this.locationUserRepository.updateById(
        id,
        newLocation,
      );
      return {code: 200, data: await this.locationUserRepository.findById(id)};
    }
  }

  @get('/location-users/')
  @response(200, {
    description: 'LocationUser model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(LocationUser, {includeRelations: true}),
      },
    },
  })
  async findById(@param.query.object('filter') filter: any): Promise<any> {
    const data = await this.locationUserRepository.find(filter);
    return data;
  }

  @del('/location-users/{idOfUser}/location-id/{id}')
  @response(204, {
    description: 'LocationUser DELETE success',
  })
  async deleteById(
    @param.path.string('id') id: string,
    @param.path.string('idOfUser') idOfUser: string,
  ): Promise<void> {
    await this.locationUserRepository.deleteAll({idOfUser, id});
  }
}
