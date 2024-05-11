import {Entity, model, property} from '@loopback/repository';
import {v4 as uuid} from 'uuid'

@model({settings: {}})
export class Category extends Entity {
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
  cateName: string;

  @property({
    type: 'string',
    required: true,
  })
  description: string;

  @property({
    type: 'object',
    required: true,
  })
  image: object;

  @property({
    type: 'string',
    required: true,
  })
  status: string;

  @property({
    type: 'date',
    required: false,
  })
  createdAt: string;


  @property({
    type: 'string',
    required: false,
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

  constructor(data?: Partial<Category>) {
    super(data);
  }
}

export interface CategoryRelations {
  // describe navigational properties here
}

export type CategoryWithRelations = Category & CategoryRelations;
