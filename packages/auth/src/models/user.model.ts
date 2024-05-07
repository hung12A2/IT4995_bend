import {Entity, model, property} from '@loopback/repository';
import {v4 as uuid} from 'uuid';

@model({settings: {}})
export class User extends Entity {
  @property({
    type: 'string',
    id: true,
    default: () => uuid()
  })
  id?: string;

  @property({
    type: 'string',
    required: false,
  })
  idOfShop?: string;

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
  password: string;

  @property({
    type: 'string',
    required: true,
  })
  phoneNumber: string;

  @property({
    type: 'string',
    required: true,
  })
  gender: string;

  @property({
    type: 'string',
    required: true,
  })
  fullName: string;

  @property({
    type: 'string',
    required: true,
  })
  role: string;

  @property({
    type: 'string',
    required: true,
  })
  status: string;

  @property({
    type: 'object',
    required: false,
  })
  coverImage: object;

  @property({
    type: 'object',
    required: false,
  })
  avatar: object;

  @property({
    type: 'string',
    required: false,
  })
  resetToken: string;

  @property({
    type: 'date',
    required: true,
  })
  createdAt: string ;

  @property({
    type: 'date',
    required: true,
  })
  updatedAt: string;

  @property({
    type: 'string',
    required: false,
  })
  updatedBy: string;


  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
