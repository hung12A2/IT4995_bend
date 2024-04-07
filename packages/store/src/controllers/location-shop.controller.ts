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
import {LocationShop} from '../models';
import {LocationShopRepository} from '../repositories';

export class LocationShopController {
  constructor(
    @repository(LocationShopRepository)
    public locationShopRepository: LocationShopRepository,
  ) {}

  @post('/location-shops/{idOfShop}')
  @response(200, {
    description: 'LocationShop model instance',
    content: {'application/json': {schema: getModelSchemaRef(LocationShop)}},
  })
  async create(
    @param.path.string('idOfShop') idOfShop: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(LocationShop, {
            title: 'NewLocationShop',
            exclude: ['id'],
          }),
        },
      },
    })
    locationShop: Omit<LocationShop, 'id'>,
  ): Promise<LocationShop> {
    const newLocation = {
      ...locationShop,
      idOfShop,
      isDefault: false,
    };
    return this.locationShopRepository.create(newLocation);
  }

  @get('/location-shops/{idOfShop}')
  @response(200, {
    description: 'LocationShop model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(LocationShop, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('idOfShop') idOfShop: string,
  ): Promise<any> {
    return this.locationShopRepository.find({where: {idOfShop}});
  }

  @patch('/location-shops/{idOfShop}/location-id/{id}')
  @response(204, {
    description: 'LocationShop PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @param.path.string('idOfShop') idOfShop: string,

    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(LocationShop, {partial: true}),
        },
      },
    })
    locationShop: LocationShop,
  ): Promise<any> {
    const newLocation = {...locationShop};
    await this.locationShopRepository.updateAll(locationShop, {idOfShop, id});
    return this.locationShopRepository.find({where: {idOfShop, id}});
  }

  @del('/location-shops/{idOfShop}/location-id/{id}')
  @response(204, {
    description: 'LocationShop DELETE success',
  })
  async deleteById(
    @param.path.string('id') id: string,
    @param.path.string('idOfShop') idOfShop: string,
  ): Promise<void> {
    await this.locationShopRepository.deleteAll({idOfShop, id});
  }
}
