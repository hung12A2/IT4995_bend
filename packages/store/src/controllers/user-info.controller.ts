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
import {UserInfo} from '../models';
import {UserInfoRepository} from '../repositories';

export class UserInfoController {
  constructor(
    @repository(UserInfoRepository)
    public userInfoRepository : UserInfoRepository,
  ) {}

  @post('/user-infos/{id}')
  @response(200, {
    description: 'UserInfo model instance',
    content: {'application/json': {schema: getModelSchemaRef(UserInfo)}},
  })
  async create(
  @param.path.string('id') id: string,
  ): Promise<UserInfo> {
    return this.userInfoRepository.create({idOfUser: id});
  }

  @get('/user-infos/count')
  @response(200, {
    description: 'UserInfo model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(UserInfo) where?: Where<UserInfo>,
  ): Promise<Count> {
    return this.userInfoRepository.count(where);
  }

  @get('/user-infos')
  @response(200, {
    description: 'Array of UserInfo model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(UserInfo, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(UserInfo) filter?: Filter<UserInfo>,
  ): Promise<UserInfo[]> {
    return this.userInfoRepository.find(filter);
  }


  @get('/user-infos/{id}')
  @response(200, {
    description: 'UserInfo model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(UserInfo, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(UserInfo, {exclude: 'where'}) filter?: FilterExcludingWhere<UserInfo>
  ): Promise<UserInfo> {
    return this.userInfoRepository.findById(id, filter);
  }

}
