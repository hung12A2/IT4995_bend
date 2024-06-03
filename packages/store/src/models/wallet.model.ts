import {Entity, model, property} from '@loopback/repository';
import {v4 as uuid} from 'uuid';

@model({settings: {}})
export class Wallet extends Entity {
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
  idOfUser: string;

  @property({
    postgresql: {
      dataType: 'bigint',
    },
    type: 'number',
    required: false,
    default: 0,
  })
  amountMoney: number;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Wallet>) {
    super(data);
  }
}

export interface WalletRelations {
  // describe navigational properties here
}

export type WalletWithRelations = Wallet & WalletRelations;
