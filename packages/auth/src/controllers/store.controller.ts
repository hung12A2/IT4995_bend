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
import {Store} from '../models';
import {StoreRepository} from '../repositories';
import {basicAuthorization} from '../services/basicAuthorize';
import {authorize} from '@loopback/authorization';
import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {SecurityBindings, UserProfile} from '@loopback/security';
import {geometry} from '../utils/getGeometry';

export class StoreController {
  constructor(
    @repository(StoreRepository)
    public storeRepository: StoreRepository,
  ) {}

  // for admin + user
  @get('/stores')
  @response(200, {
    description: 'Array of Store model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Store, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(Store) filter?: Filter<Store>): Promise<Store[]> {
    return await this.storeRepository.find(filter);
  }

  @get('/stores/count')
  @response(200, {
    description: 'Array of Store model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Store, {includeRelations: true}),
        },
      },
    },
  })
  async count(@param.filter(Store) filter?: Filter<Store>): Promise<any> {
    return await this.storeRepository.count(filter);
  }

  // for admin + store owner
  // tim day du thong tin shop cua minh
  // tim thong tin shop nguoi khac bang filter
  @get('/stores/{id}')
  @response(200, {
    description: 'Store model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Store, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Store, {exclude: 'where'})
    filter?: FilterExcludingWhere<Store>,
  ): Promise<Store> {
    return this.storeRepository.findById(id, filter);
  }

  // for store owner update store info
  // for admin update permission of store
  @authenticate('jwt')
  @authorize({voters: [basicAuthorization], allowedRoles: ['customer']})
  @patch('/storesUpdate')
  @response(204, {
    description: 'Store PATCH success',
  })
  async updateById(
    @inject(SecurityBindings.USER)
    currentUser: UserProfile,
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
          },
        },
      },
    })
    store: any,
  ): Promise<any> {
    const idOfUser = currentUser.id;

    const idOfShop = currentUser.idOfShop;
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
    } = store;

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

    const newShop = {
      pickUpGeometry,
      returnGeometry,
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
    };

    await this.storeRepository.updateById(idOfShop, newShop);

    return this.storeRepository.findById(idOfShop);
  }

  // for store owner
  @patch('/stores/stopWorking/{id}')
  @response(204, {
    description: 'Store stopWorking success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.storeRepository.updateById(id, {status: 'stopWorking'});
  }

  // for admin
  @post('/stores/banned/{id}')
  @response(204, {
    description: 'Store Banned success',
  })
  async BanedById(@param.path.string('id') id: string): Promise<void> {
    await this.storeRepository.updateById(id, {status: 'banned'});
  }

  @post('/stores/unbanned/{id}')
  @response(204, {
    description: 'Store Banned success',
  })
  async UnbanedById(@param.path.string('id') id: string): Promise<void> {
    await this.storeRepository.updateById(id, {status: 'active'});
  }

  @get('/searches/{keyWord}')
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
  async findProductByKey(
    @param.path.string('keyWord') keyWord: string,
    @param.query.object('filter') filter?: any,
  ): Promise<any> {
    if (keyWord === 'all') { 
      keyWord = '';
    }
    let productsReturn = [];

    let products = await this.storeRepository.find(filter);

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
