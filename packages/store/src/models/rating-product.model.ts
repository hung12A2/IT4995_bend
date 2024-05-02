import {Entity, model, property} from '@loopback/repository';
import {v4 as uuid} from 'uuid';

@model({settings: {}})
export class RatingProduct extends Entity {
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
    type: 'string',
    required: true,
  })
  idOfUser: string;

  @property({
    type: 'number',
    required: true,
  })
  rating: number;

  @property({
    type: 'boolean',
    required: true,
  })
  isDeleted: boolean;

  @property({
    type: 'boolean',
    required: false,
    default: false,
  })
  isKiot: boolean;

  @property({
    type: 'string',
    default: '',
  })
  comment?: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<RatingProduct>) {
    super(data);
  }
}

export interface RatingProductRelations {
  // describe navigational properties here
}

export type RatingProductWithRelations = RatingProduct & RatingProductRelations;
