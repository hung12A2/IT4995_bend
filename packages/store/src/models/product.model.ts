import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class Product extends Entity {
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
  name: string;

  @property({
    type: 'object',
    required: true,
  })
  image: object;

  @property({
    type: 'string',
    required: true,
  })
  idOfCategory: string;

  @property({
    type: 'string',
    required: true,
  })
  idOfShop: string;

  @property({
    type: 'string',
    required: true,
  })
  productDescription: string;

  @property({
    type: 'string',
    required: true,
  })
  productDetails: string;

  @property({
    type: 'number',
    required: true,
  })
  price: number;

  @property({
    type: 'number',
    required: true,
  })
  countInStock: number;

  @property({
    type: 'boolean',
    required: true,
  })
  isBestSeller: boolean;

  @property({
    type: 'string',
    required: true,
  })
  cateName: string;

  @property({
    type: 'string',
    required: true,
  })
  status: string;

  @property({
    type: 'number',
    required: true,
  })
  weight: number;

  @property({
    type: 'string',
    required: true,
  })
  dimension: string;

  @property({
    type: 'number',
    required: true,
  })
  rating: number;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Product>) {
    super(data);
  }
}

export interface ProductRelations {
  // describe navigational properties here
}

export type ProductWithRelations = Product & ProductRelations;
