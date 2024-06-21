import {Entity, model, property} from '@loopback/repository';
import {v4 as uuid} from 'uuid';

@model({settings: {strict: false}})
export class ProductInAddForm extends Entity {
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
  idOfForm: string;

  @property({
    type: 'string',
    required: true,
  })
  idOfProduct: string;

  @property({
    type: 'string',
    required: true,
  })
  quantity: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<ProductInAddForm>) {
    super(data);
  }
}

export interface ProductInAddFormRelations {
  // describe navigational properties here
}

export type ProductInAddFormWithRelations = ProductInAddForm & ProductInAddFormRelations;
