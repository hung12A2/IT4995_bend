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
    required: true,
  })
  description: string;

  @property({
    type: 'string',
    required: true,
  })
  status: string;

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
  pickUpProvinceName: string;

  @property({
    type: 'string',
    required: true,
  })
  pickUpProvinceId: string;

  @property({
    type: 'string',
    required: true,
  })
  pickUpDistrictName: string;

  @property({
    type: 'string',
    required: true,
  })
  pickUpDistrictId: string;

  @property({
    type: 'string',
    required: true,
  })
  pickUpWardName: string;

  @property({
    type: 'string',
    required: true,
  })
  pickUpWardId: string;

  @property({
    type: 'string',
    required: true,
  })
  returnAddress: string;

  @property({
    type: 'string',
    required: true,
  })
  returnProvinceName: string;

  @property({
    type: 'string',
    required: true,
  })
  returnProvinceId: string;

  @property({
    type: 'string',
    required: true,
  })
  returnDistrictName: string;

  @property({
    type: 'string',
    required: true,
  })
  returnDistrictId: string;

  @property({
    type: 'string',
    required: true,
  })
  returnWardName: string;

  @property({
    type: 'string',
    required: true,
  })
  returnWardId: string;

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

  @property({
    type: 'Date',
    required: false,
  })
  createdAt: string;

  @property({
    type: 'Date',
    required: false,
  })
  updatedAt: string;

  @property({
    type: 'string',
    required: false,
  })
  acceptedBy: string;

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
