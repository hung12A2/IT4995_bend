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
import {Employee} from '../models';
import {
  EmployeeRepository,
  KiotRepository,
  StoreRepository,
} from '../repositories';
import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {SecurityBindings, UserProfile} from '@loopback/security';
import {Storage} from '@google-cloud/storage';
import {generateRandomString} from '../utils/genString';
import {authorize} from '@loopback/authorization';
import {basicAuthorization} from '../services/basicAuthorize';

export class EmployeeController {
  constructor(
    @repository(EmployeeRepository)
    public employeeRepository: EmployeeRepository,
    @repository(StoreRepository)
    public storeRepository: StoreRepository,
    @repository(KiotRepository)
    public kiotRepository: KiotRepository,
    @inject(RestBindings.Http.RESPONSE)
    private response: Response,
  ) {}

  // for storeOwner
  @authenticate('jwt')
  @authorize({voters: [basicAuthorization], allowedRoles: ['customer']})
  @post('/employees')
  @response(200, {
    description: 'Employee model instance',
    content: {'application/json': {schema: getModelSchemaRef(Employee)}},
  })
  async create(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
    @inject(RestBindings.Http.RESPONSE) response: Response,
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              email: {type: 'string'},
              name: {type: 'string'},
              permissions: {type: 'string'},
              phoneNumber: {type: 'string'},
            },
          },
        },
      },
    })
    employee: any,
  ): Promise<any> {
    employee.role = 'employee';
    employee.status = 'active';
    employee.password = generateRandomString(10);
    const idOfUser = currentUserProfile.id;
    const idOfShop = (
      await this.storeRepository.find({where: {idOfUser: idOfUser}})
    )[0].id;

    if (!idOfShop) {
      return {
        code: 400,
        message: 'not found shop',
      };
    }

    const idOfKiot = (
      await this.kiotRepository.find({where: {idOfUser: idOfUser}})
    )[0].id;

    const numberOfEmployee = await this.employeeRepository.count({
      idOfShop: idOfShop,
    });
    if (numberOfEmployee.count > 2) {
      return {
        code: 400,
        message: 'number of employee is max',
      };
    }

    if (idOfShop) {
      employee.idOfShop = idOfShop;
      if (idOfKiot) {
        employee.idOfKiot = idOfKiot;
      }
    } else {
      return {
        code: 400,
        message: 'not found shop',
      };
    }

    const data = await this.employeeRepository.create(employee);

    return {
      code: 200,
      data,
    };
  }

  // for admin
  @get('/employees')
  @response(200, {
    description: 'Array of Employee model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Employee, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(Employee) filter?: Filter<Employee>): Promise<any> {
    const employee = await this.employeeRepository.find(filter);
    this.response.header('Access-Control-Expose-Headers', 'Content-Range');
    return this.response
      .header('Content-Range', `Employees 0-20/20`)
      .send(employee);
  }

  // for storeOwner
  @get('/employees/{id}')
  @response(200, {
    description: 'Employee model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Employee, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Employee, {exclude: 'where'})
    filter?: FilterExcludingWhere<Employee>,
  ): Promise<Employee> {
    return this.employeeRepository.findById(id, filter);
  }

  // for storeOwner
  @patch('/employees/inActive/{id}')
  @response(204, {
    description: 'Employee PATCH success',
  })
  async inActiveById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Employee, {partial: true}),
        },
      },
    })
    employee: Employee,
  ): Promise<void> {
    await this.employeeRepository.updateById(id, {status: 'inActive'});
  }

  // for storeOwner update permission
  // update info of employee
  // change Password
  @patch('/employees/{id}')
  @response(204, {
    description: 'Employee PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Employee, {partial: true}),
        },
      },
    })
    employee: Employee,
  ): Promise<void> {
    await this.employeeRepository.updateById(id, employee);
  }

  @patch('/employees/banned/{id}')
  @response(204, {
    description: 'Employee DELETE success',
  })
  async bannedById(@param.path.string('id') id: string): Promise<void> {
    await this.employeeRepository.updateById(id, {status: 'banned'});
  }

  // upload avatar for employee
}
