import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class WalletOfShop extends Entity {
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
    default: 0,
  })
  amountOfMoney?: number;

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
