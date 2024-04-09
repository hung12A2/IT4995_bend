import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class ProductsInCart extends Entity {
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

  constructor(data?: Partial<ProductsInCart>) {
    super(data);
  }
}

export interface ProductsInCartRelations {
  // describe navigational properties here
}

export type ProductsInCartWithRelations = ProductsInCart & ProductsInCartRelations;
