// Uncomment these imports to begin using these cool features!

// import {inject} from '@loopback/core';
// ReqCreateShopController

import {inject} from '@loopback/core';
import {
  post,
  requestBody,
  get,
  RestBindings,
  Response,
  Request,
  response,
  param,
  patch,
} from '@loopback/rest';
import {authenticate} from '@loopback/authentication';
import axios from '../services/authAxios.service';
import multer from 'multer';
import {authorize} from '@loopback/authorization';
import {basicAuthorization} from '../services/basicAuthorize';
import {SecurityBindings, UserProfile} from '@loopback/security';

const storage = multer.memoryStorage();
const upload = multer({storage});

var cpUpload = upload.fields([{name: 'IDcardImg'}, {name: 'BLicenseImg'}]);
// import {inject} from '@loopback/core';

export class EmployeeController {
  constructor(
    @inject(RestBindings.Http.RESPONSE) public response: Response,
    @inject(RestBindings.Http.REQUEST) public request: Request,
  ) {}

  @authenticate('jwt')
  @authorize({voters: [basicAuthorization], allowedRoles: ['customer']})
  @post('employees/create', {
    responses: {
      '200': {
        description: 'Return new employee',
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
      },
    },
  })
  async createEmployee(
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
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise<any> {
    const data = axios
      .post('/employees', employee, {
        headers: {
          authorization: this.request.headers.authorization,
        },
      })
      .then(res => res)
      .catch(e => console.log(e));

    return data;
  }

  @authenticate('jwt')
  @authorize({voters: [basicAuthorization], allowedRoles: ['customer']})
  @patch('employees/{id}', {
    responses: {
      '200': {
        description: 'Return new employee',
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
      },
    },
  })
  async updateEmployee(
    @param.path.string('id') id: string,
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
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise<any> {
    const data = axios
      .patch(`/employees/${id}`, employee, {
        headers: {
          authorization: this.request.headers.authorization,
        },
      })
      .then(res => res)
      .catch(e => console.log(e));

    return data;
  }

  @authenticate('jwt')
  @get('employees', {
    responses: {
      '200': {
        description: 'Return new area',
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
      },
    },
  })
  async getAllEmployee(
    @param.query.object('filter') filter: string,
  ): Promise<any> {
    const data = await axios
      .get(`/employees`, {
        params: {filter},
        headers: {authorization: this.request.headers.authorization},
      })
      .then(res => res)
      .catch(e => console.log(e));

    return data;
  }

  @authenticate('jwt')
  @authorize({voters: [basicAuthorization], allowedRoles: ['employee']})
  @get('employeesForShop', {
    responses: {
      '200': {
        description: 'Return new area',
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
      },
    },
  })
  async getAllEmployeeForShop(
    @inject(SecurityBindings.USER) currentUser: UserProfile,
    @param.query.object('filter') filter: any,
  ): Promise<any> {
    const idOfShop = currentUser.idOfShop;
    let where: any;
    if (filter) {
      where = filter?.where || {};
      where = {...where, idOfShop};
      filter.where = where;
    }
    const data = await axios
      .get(`/employees`, {
        params: {filter},
        headers: {authorization: this.request.headers.authorization},
      })
      .then(res => res)
      .catch(e => console.log(e));

    return data;
  }

  @authenticate('jwt')
  @authorize({voters: [basicAuthorization], allowedRoles: ['employee']})
  @get('employeesForShop/count', {
    responses: {
      '200': {
        description: 'Return new area',
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
      },
    },
  })
  async countAllEmployeeForShop(
    @inject(SecurityBindings.USER) currentUser: UserProfile,
    @param.query.object('filter') filter: any,
  ): Promise<any> {
    const idOfShop = currentUser.idOfShop;
    let where: any;
    if (filter) {
      where = filter?.where || {};
      where = {...where, idOfShop};
      filter.where = where;
    }
    const data = await axios
      .get(`/employees/count`, {
        params: {filter},
        headers: {authorization: this.request.headers.authorization},
      })
      .then(res => res)
      .catch(e => console.log(e));

    return data;
  }

  @authenticate('jwt')
  @authorize({voters: [basicAuthorization], allowedRoles: ['employee']})
  @get('employeesForShop/{id}', {
    responses: {
      '200': {
        description: 'Return new area',
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
      },
    },
  })
  async getOneForShop(@param.path.string('id') id: string): Promise<any> {
    const data = await axios
      .get(`/employees/${id}`, {
        headers: {authorization: this.request.headers.authorization},
      })
      .then(res => res)
      .catch(e => console.log(e));

    return data;
  }

  @authenticate('jwt')
  @get('employees/count', {
    responses: {
      '200': {
        description: 'Return new area',
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
      },
    },
  })
  async count(@param.query.object('filter') filter: string): Promise<any> {
    const data = await axios
      .get(`/employees/count`, {
        params: {filter},
        headers: {
          Authorization: this.request.headers.authorization,
        },
      })
      .then(res => res)
      .catch(e => console.log(e));

    return data;
  }

  @authenticate('jwt')
  @get('employees/{id}', {
    responses: {
      '200': {
        description: 'Return new area',
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
      },
    },
  })
  async getOne(@param.path.string('id') id: string): Promise<any> {
    const data = await axios
      .get(`/employees/${id}`, {
        headers: {
          Authorization: this.request.headers.authorization,
        },
      })
      .then(res => res)
      .catch(e => console.log(e));

    return data;
  }

  @authenticate('jwt')
  @authorize({voters: [basicAuthorization], allowedRoles: ['customer']})
  @post('employees/inActive/{id}', {
    responses: {
      '200': {
        description: 'Return new area',
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
      },
    },
  })
  async inActiveEmployees(@param.path.string('id') id: string): Promise<any> {
    const data = await axios
      .patch(
        `/employees/inActive/${id}`,
        {},
        {
          headers: {
            authorization: this.request.headers.authorization,
          },
        },
      )
      .then(res => res)
      .catch(e => console.log(e));

    return data;
  }

  @authenticate('jwt')
  @authorize({voters: [basicAuthorization], allowedRoles: ['customer']})
  @post('employees/active/{id}', {
    responses: {
      '200': {
        description: 'Return new area',
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
      },
    },
  })
  async activeEmployees(@param.path.string('id') id: string): Promise<any> {
    const data = await axios
      .patch(
        `/employees/active/${id}`,
        {},
        {
          headers: {
            authorization: this.request.headers.authorization,
          },
        },
      )
      .then(res => res)
      .catch(e => console.log(e));

    return data;
  }

  @authenticate('jwt')
  @authorize({voters: [basicAuthorization], allowedRoles: ['admin']})
  @post('employees/banned/{id}', {
    responses: {
      '200': {
        description: 'Return new area',
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
      },
    },
  })
  async banned(@param.path.string('id') id: string): Promise<any> {
    const data = await axios
      .patch(
        `/employees/banned/${id}`,
        {},
        {
          headers: {
            authorization: this.request.headers.authorization,
          },
        },
      )
      .then(res => res)
      .catch(e => console.log(e));

    return data;
  }

  @authenticate('jwt')
  @authorize({voters: [basicAuthorization], allowedRoles: ['admin']})
  @post('employees/banned/{id}', {
    responses: {
      '200': {
        description: 'Return new area',
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
      },
    },
  })
  async unbanned(@param.path.string('id') id: string): Promise<any> {
    const data = await axios
      .patch(
        `/employees/unbanned/${id}`,
        {},
        {
          headers: {
            authorization: this.request.headers.authorization,
          },
        },
      )
      .then(res => res)
      .catch(e => console.log(e));

    return data;
  }
}
