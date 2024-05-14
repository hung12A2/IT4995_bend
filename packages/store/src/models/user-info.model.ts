import {Entity, model, property} from '@loopback/repository';
import {v4 as uuid} from 'uuid';

@model({settings: {strict: false}})
export class UserInfo extends Entity {
  @property({
    type: 'string',
    id: true,
    default: () => uuid(),
  })
  id?: string;

  @property({
    type: 'number',
    default: 0,
  })
  numberOfOrder?: number;

  @property({
    type: 'number',
    default: 0,
  })
  numberOfSuccesOrder?: number;

  @property({
    type: 'number',
    default: 0,
  })
  numberOfReturnOrder?: number;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<UserInfo>) {
    super(data);
  }
}

export interface UserInfoRelations {
  // describe navigational properties here
}

export type UserInfoWithRelations = UserInfo & UserInfoRelations;
