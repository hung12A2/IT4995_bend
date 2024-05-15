import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class NotificationForShop extends Entity {
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
    required: true,
  })
  content: string;

  @property({
    type: 'object',
    required: false,
  })
  image: object;

  @property({
    type: 'boolean',
    default: false,
  })
  isViewed?: boolean;

  @property({
    type: 'date',
    required: true,
  })
  createdAt: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<NotificationForShop>) {
    super(data);
  }
}

export interface NotificationForShopRelations {
  // describe navigational properties here
}

export type NotificationForShopWithRelations = NotificationForShop & NotificationForShopRelations;
