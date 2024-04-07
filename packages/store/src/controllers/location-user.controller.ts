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

export class LocationUserController {
  constructor(
    @repository(LocationUserRepository)
    public locationUserRepository: LocationUserRepository,
  ) {}

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
          schema: getModelSchemaRef(LocationUser, {
            title: 'NewLocationUser',
            exclude: ['id'],
          }),
        },
      },
    })
    locationUser: Omit<LocationUser, 'id'>,
  ): Promise<any> {
    const newLocation = {
      ...locationUser,
      isDefault: false,
      idOfUser,
    };
    return this.locationUserRepository.create(newLocation);
  }

  @get('/location-users/{idOfUser}')
  @response(200, {
    description: 'LocationUser model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(LocationUser, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('idOfUser') idOfUser: string,
  ): Promise<any> {
    return this.locationUserRepository.find({where: {idOfUser}});
  }

  // set default here 
  @patch('/location-users/{idOfUser}/location-id/{id}')
  @response(204, {
    description: 'LocationUser PATCH success',
  })
  async updateById(
    @param.path.string('idOfUser') idOfUser: string,
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(LocationUser, {partial: true}),
        },
      },
    })
    locationUser: LocationUser,
  ): Promise<any> {
    const newLocation: any = {
      ...locationUser,
      idOfUser,
    };

    await this.locationUserRepository.updateAll(newLocation, {idOfUser, id});
    return this.locationUserRepository.find({where: {idOfUser, id}});
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
