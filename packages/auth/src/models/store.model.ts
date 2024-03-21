import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class Store extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  idOfUser: string;

  @property({
    type: 'object',
    required: true,
  })
  coverImage: object;

  @property({
    type: 'object',
    required: true,
  })
  avartar: object;

  @property({
    type: 'string',
    required: true,
  })
  description: string;

  @property({
    type: 'string',
    required: true,
  })
  permissions: string;

  @property({
    type: 'number',
    required: true,
  })
  numberOfProducts: number;

  @property({
    type: 'number',
    required: true,
  })
  avgRating: number;

  @property({
    type: 'object',
    required: true,
  })
  IDcardImg: object;

  @property({
    type: 'object',
    required: true,
  })
  BLicenseImg: object;

  @property({
    type: 'string',
    required: true,
  })
  pickUpAddress: string;

  @property({
    type: 'string',
    required: true,
  })
  returnAddress: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  phoneNumber: string;
  
  @property({
    type: 'string',
    required: true,
  })
  email: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Store>) {
    super(data);
  }
}

export interface StoreRelations {
  // describe navigational properties here
}

export type StoreWithRelations = Store & StoreRelations;
