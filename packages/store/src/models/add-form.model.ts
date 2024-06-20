import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class AddForm extends Entity {
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
