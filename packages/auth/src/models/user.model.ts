import {Entity, model, property} from '@loopback/repository';

@model()
export class User extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
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
    type: 'Date',
    required: false,
  })
  createdAt: Date;

  @property({
    type: 'Date',
    required: false,
  })
  updatedAt: Date;


  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
