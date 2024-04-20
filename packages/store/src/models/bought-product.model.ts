import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class BoughtProduct extends Entity {
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
  createAt: Date;

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
