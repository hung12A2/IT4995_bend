import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class Order extends Entity {
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
  paymentMethod: string;

  @property({
    type: 'string',
    required: true,
  })
  idOfUser: string;

  @property({
    type: 'string',
    required: true,
  })
  fromName: string;

  @property({
    type: 'string',
    required: true,
  })
  fromPhone: string;

  @property({
    type: 'string',
    required: true,
  })
  fromAddress: string;

  @property({
    type: 'string',
    required: true,
  })
  fromProvince: string;

  @property({
    type: 'string',
    required: true,
  })
  fromDistrict: string;

  @property({
    type: 'string',
    required: true,
  })
  fromWard: string;

  @property({
    type: 'string',
    required: true,
  })
  toName: string;

  @property({
    type: 'string',
    required: true,
  })
  toPhone: string;

  @property({
    type: 'string',
    required: true,
  })
  toAddress: string;

  @property({
    type: 'string',
    required: true,
  })
  toProvince: string;

  @property({
    type: 'string',
    required: true,
  })
  toDistrict: string;

  @property({
    type: 'string',
    required: true,
  })
  toWard: string;


  @property({
    type: 'string',
    required: true,
  })
  clientOrderCode: string;

  @property({
    type: 'number',
    required: true,
  })
  codAmount: number;

  @property({
    type: 'string',
    default: 'no content',
  })
  content?: string;

  @property({
    type: 'number',
    required: true,
  })
  weight: number;

  @property({
    type: 'string',
    required: true,
  })
  dimension: string;

  @property({
    type: 'number',
    required: true,
  })
  insuranceValue: number;

  @property({
    type: 'number',
    required: true,
  })
  serviceTypeId: number;

  @property({
    type: 'number',
    required: true,
  })
  serviceId: number;

  @property({
    type: 'number',
    required: true,
  })
  paymentTypeId: number;

  @property({
    type: 'string',
    required: true,
  })
  requiredNote: string;

  @property({
    type: 'string',
    required: true,
  })
  status: string;

  @property({
    type: 'number',
    required: false,
    default: 0,
  })
  totalFee: number;

  @property({
    type: 'number',
    required: false,
    default: 0,
  })
  priceOfAll: number;

  @property({
    type: 'string',
    default: 'no note',
  })
  note?: string;

  @property({
    type: 'array',
    itemType: 'number',
    default: null,
  })
  pickShift?: number[];

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

  @property({
    type: 'object',
    required: true,
  })
  image: object;


  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Order>) {
    super(data);
  }
}

export interface OrderRelations {
  // describe navigational properties here
}

export type OrderWithRelations = Order & OrderRelations;
