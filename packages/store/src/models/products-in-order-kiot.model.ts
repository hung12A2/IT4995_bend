import {Entity, model, property} from '@loopback/repository';
import {v4 as uuid} from 'uuid';

@model({settings: {}})
export class ProductsInOrderKiot extends Entity {
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
  idOfOrder: string;

  @property({
    type: 'string',
    required: true,
  })
  idOfProduct: string;

  @property({
    type: 'number',
    required: true,
  })
  quantity: number;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<ProductsInOrderKiot>) {
    super(data);
  }
}

export interface ProductsInOrderKiotRelations {
  // describe navigational properties here
}

export type ProductsInOrderKiotWithRelations = ProductsInOrderKiot & ProductsInOrderKiotRelations;
