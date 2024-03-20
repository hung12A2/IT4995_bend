import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class RequestCreateShop extends Entity {
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
    type: 'string',
    required: true,
  })
  status: string;

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
  phoneNumber: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<RequestCreateShop>) {
    super(data);
  }
}

export interface RequestCreateShopRelations {
  // describe navigational properties here
}

export type RequestCreateShopWithRelations = RequestCreateShop & RequestCreateShopRelations;
