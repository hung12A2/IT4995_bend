import {Entity, model, property} from '@loopback/repository';
import {v4 as uuid} from 'uuid';

@model({settings: {strict: false}})
export class ShopInfo extends Entity {
  @property({
    type: 'string',
    id: true,
    default: () => uuid(),
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  idOfShop: string;

  @property({
    type: 'number',
    required: false,
    default: 0,
  })
  numberOfProduct: number;

  @property({
    postgresql: {
      dataType: 'float',
    },
    type: 'number',
    required: false,
    default: 0,
  })
  avgRating: number;

  @property({
    type: 'number',
    required: false,
    default: 0,
  })
  numberOfRating: number;

  @property({
    type: 'number',
    required: false,
    default: 0,
  })
  numberOfSold: number;

  @property({
    type: 'number',
    required: false,
    default: 0,
  })
  numberOfOrder: number;

  @property({
    type: 'number',
    required: false,
    default: 0,
  })
  numberOfSuccesOrder: number;

  @property({
    type: 'number',
    required: false,
    default: 0,
  })
  numberOfRejectOrder: number;

  @property({
    type: 'number',
    required: false,
    default: 0,
  })
  numberOfReturnOrder: number;

  @property({
    type: 'number',
    required: false,
    default: 0,
  })
  numberOfFailedOrder: number;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<ShopInfo>) {
    super(data);
  }
}

export interface ShopInfoRelations {
  // describe navigational properties here
}

export type ShopInfoWithRelations = ShopInfo & ShopInfoRelations;
