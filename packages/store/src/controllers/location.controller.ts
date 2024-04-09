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
import axios from 'axios';

export class LocationController {
  constructor(
    @repository(LocationUserRepository)
    public locationUserRepository: LocationUserRepository,
  ) {}

  @get('/location/province')
  @response(200, {
    description: 'Array of LocationUser model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(LocationUser, {includeRelations: true}),
        },
      },
    },
  })
  async findProvince(): Promise<any> {
    try {
      const response = await axios.get(
        'https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province',
        {
          headers: {
            'Content-Type': 'application/json',
            Token: '33108a16-e157-11ee-8bfa-8a2dda8ec551',
          },
        },
      );
      if (response.status === 200) {
        const data = response.data.data;
        return data.map((item: any) => {
          return {
            provincId: item.ProvinceID,
            provinceName: item.ProvinceName,
          };
        });
      } else {
        return {
          message: 'Error when get data from GHN',
        };
      }
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  }

  @get('/location/province/{idOfProvince}')
  @response(200, {
    description: 'Array of LocationUser model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(LocationUser, {includeRelations: true}),
        },
      },
    },
  })
  async findDistrict(
    @param.path.string('idOfProvince') idOfProvince: string,
  ): Promise<any> {
    const dataRaw = {
      province_id: +idOfProvince,
    };

    try {
      const response = await axios.post(
        'https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district',
        dataRaw,
        {
          headers: {
            'Content-Type': 'application/json',
            Token: '33108a16-e157-11ee-8bfa-8a2dda8ec551',
          },
          
        },
      );
      if (response.status == 200) {
        const data = response.data.data;
        return data.map((item: any) => {
          return {
            districtId: item.DistrictID,
            districtName: item.DistrictName,
            code: item.Code,
            type: item.Type,
            spType: item.SupportType,
            pickType: item.PickType,
            deliverType: item.DeliverType,
          };
        });
      } else {
        return {
          message: 'Error when get data from GHN',
        };
      }
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  }

  @get('/location/province/distric/{district_id}/ward')
  @response(200, {
    description: 'Array of LocationUser model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(LocationUser, {includeRelations: true}),
        },
      },
    },
  })
  async findWard(
    @param.path.string('district_id') district_id: string,
  ): Promise<any> {
    const dataRaw = {
      district_id: +district_id,
    };

    try {
      const response = await axios.post(
        'https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id',
        dataRaw,

        {
          headers: {
            'Content-Type': 'application/json',
            Token: '33108a16-e157-11ee-8bfa-8a2dda8ec551',
          },
        },
      );
      if (response.status == 200) {
        const data = response.data.data;
        return data.map((item: any) => {
          return {
            wardCode: item.WardCode,
            wardName: item.WardName,
          };
        });
      } else {
        return {
          message: 'Error when get data from GHN',
        };
      }
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  }
}
