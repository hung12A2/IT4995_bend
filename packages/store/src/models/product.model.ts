import {Entity, model, property} from '@loopback/repository';
import {v4 as uuid} from 'uuid';

@model({settings: {}})
export class Product extends Entity {
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
  name: string;

  @property({
    type: 'array',
    itemType: 'object',
    required: true,
  })
  image: object[];

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
    required: false,
  })
  idOfKiot: string;

  @property({
    type: 'boolean',
    required: true,
  })
  isOnlineProduct: boolean;

  @property({
    type: 'boolean',
    required: true,
  })
  isKiotProduct: boolean;

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
    postgresql: {
      dataType: 'float',
    },
    type: 'number',
    required: true,
  })
  rating: number;


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
    type: 'date',
    required: true,
  })
  createdAt: string;


  @property({
    type: 'string',
    required: true,
  })
  createdBy: string;

  @property({
    type: 'string',
    required: false,
  })
  updatedBy: string;

  @property({
    type: 'date',
    required: true,
  })
  updatedAt: string;

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
