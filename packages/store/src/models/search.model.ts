import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class Search extends Entity {
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
  keyWord: string;

  @property({
    type: 'string',
    required: true,
  })
  idOfUser: string;

  @property({
    type: 'date',
    required: true,
  })
  createdAt: string;

  @property({
    type: 'date',
    required: true,
  })
  updatedAt: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Search>) {
    super(data);
  }
}

export interface SearchRelations {
  // describe navigational properties here
}

export type SearchWithRelations = Search & SearchRelations;
