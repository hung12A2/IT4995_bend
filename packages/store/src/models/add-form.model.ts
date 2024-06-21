import {Entity, model, property} from '@loopback/repository';
import {v4 as uuid} from 'uuid'


@model({settings: {strict: false}})
export class AddForm extends Entity {
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
  idOfShop: string;

  @property({
    type: 'string',
    required: false,
    default: 'no note',
  })
  note: string;


  @property({
    type: 'date',
    required: true,
  })
  createdAt: string;

  @property({
    type: 'string',
    required: true,
  })
  type: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<AddForm>) {
    super(data);
  }
}

export interface AddFormRelations {
  // describe navigational properties here
}

export type AddFormWithRelations = AddForm & AddFormRelations;
