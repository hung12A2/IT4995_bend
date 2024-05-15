import {Entity, model, property} from '@loopback/repository';
import {v4 as uuid} from 'uuid';

@model({settings: {}})
export class ReturnOrder extends Entity {
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
  idOfUser: string;

  @property({
    type: 'string',
    required: true,
  })
  idOfShop: string;

  @property({
    type: 'string',
    required: true,
  })
  idOfOrder: string;

  @property({
    type: 'string',
    required: true,
  })
  reason: string;

  @property({
    type: 'array',
    itemType: 'object',
    default: null,
  })
  images?: object[];

  @property({
    type: 'boolean',
    required: false,
    default: false,
  })
  isKiot: boolean;


  @property({
    type: 'date',
    required: false,
    default: () => new Date().toLocaleString(),
  })
  createdAt: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<ReturnOrder>) {
    super(data);
  }
}

export interface ReturnOrderRelations {
  // describe navigational properties here
}

export type ReturnOrderWithRelations = ReturnOrder & ReturnOrderRelations;
