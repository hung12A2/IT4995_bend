import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class TransactionShop extends Entity {
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
    type: 'number',
    required: true,
  })
  amountOfMoney: number;

  @property({
    type: 'string',
    required: true,
  })
  type: string;


  @property({
    type: 'date',
    required: true,
  })
  createdAt: string;

  @property({
    type: 'object',
    required: true,
  })
  image: object;

  @property({
    type: 'string',
    required: true,
  })
  idOfOrder: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<TransactionShop>) {
    super(data);
  }
}

export interface TransactionShopRelations {
  // describe navigational properties here
}

export type TransactionShopWithRelations = TransactionShop & TransactionShopRelations;
