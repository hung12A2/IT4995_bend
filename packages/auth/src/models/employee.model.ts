import {Entity, model, property} from '@loopback/repository';
import {v4 as uuid} from 'uuid'


@model({settings: {}})
export class Employee extends Entity {
  @property({
    type: 'string',
    id: true,
    default: () => uuid()
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  idOfShop: string;

  @property({
    type: 'string',
    required: false,
  })
  idOfKiot?: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
    required: true,
  })
  phoneNumber: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  permissions: string;

  @property({
    type: 'date',
    required: true,
  })
  createdAt: string;

  @property({
    type: 'string',
    required: true,
  })
  createdBy: string;

  @property({
    type: 'string',
    required: false,
    default: ''
  })
  resetToken: string;


  @property({
    type: 'string',
    required: true,
  })
  updatedBy: string;

  @property({
    type: 'date',
    required: true,
  })
  updatedAt: string;

  @property({
    type: 'string',
    required: true,
  })
  status: string;

  @property({
    type: 'string',
  })
  role?: string;

  @property({
    type: 'object',
    required: false,
  })
  avatar: object;

  constructor(data?: Partial<Employee>) {
    super(data);
  }
}

export interface EmployeeRelations {
  // describe navigational properties here
}

export type EmployeeWithRelations = Employee & EmployeeRelations;
