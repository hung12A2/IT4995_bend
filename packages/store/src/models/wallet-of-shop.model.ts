import {Entity, model, property} from '@loopback/repository';
import {v4 as uuid} from 'uuid';

@model({settings: {}})
export class WalletOfShop extends Entity {
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
    type: 'number',
    default: 0,
  })
  amountMoney?: number;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<WalletOfShop>) {
    super(data);
  }
}

export interface WalletOfShopRelations {
  // describe navigational properties here
}

export type WalletOfShopWithRelations = WalletOfShop & WalletOfShopRelations;
