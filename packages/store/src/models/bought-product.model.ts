import {Entity, model, property} from '@loopback/repository';
import {v4 as uuid} from 'uuid'

@model({settings: {}})
export class BoughtProduct extends Entity {
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
  idOfProduct: string;

  @property({
    type: 'string',
    required: true,
  })
  idOfUser: string;

  @property({
    type: 'string',
    required: true,
  })
  idOfOrder: string;

  @property({
    type: 'number',
    required: true,
  })
  quantity: number;

  @property({
    type: 'date',
    required: true,
  })
  createAt: string;

  @property({
    type: 'boolean',
    required: false,
    default: false,
  })
  isKiot: boolean;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<BoughtProduct>) {
    super(data);
  }
}

export interface BoughtProductRelations {
  // describe navigational properties here
}

export type BoughtProductWithRelations = BoughtProduct & BoughtProductRelations;
