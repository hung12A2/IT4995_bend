import {Entity, model, property} from '@loopback/repository';
import {v4 as uuid} from 'uuid'


@model({settings: {}})
export class Kiot extends Entity {
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
  idOfUser: string;

  @property({
    type: 'object',
  })
  coverImage?: object;

  @property({
    type: 'object',
  })
  avatar?: object;

  @property({
    type: 'string',
    required: true,
  })
  idOfArea: string;

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
    type: 'date',
    required: true,
  })
  createdAt: string;

  @property({
    type: 'date',
    required: true,
  })
  updatedAt: string;

  @property({
    type: 'string',
    required: true,
  })
  createdBy: string;

  @property({
    type: 'string',
    required: true,
  })
  updatedBy: string;

  @property({
    type: 'object',
    required: true,
  })
  pickUpGeometry: object;

  @property({
    type: 'object',
    required: true,
  })
  returnGeometry: object;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Kiot>) {
    super(data);
  }
}

export interface KiotRelations {
  // describe navigational properties here
}

export type KiotWithRelations = Kiot & KiotRelations;
