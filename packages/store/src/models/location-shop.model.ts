import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class LocationShop extends Entity {
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
  provinceName: string;

  @property({
    type: 'string',
    required: true,
  })
  provinceId: string;

  @property({
    type: 'string',
    required: true,
  })
  districtName: string;

  @property({
    type: 'string',
    required: true,
  })
  districtId: string;

  @property({
    type: 'string',
    required: true,
  })
  wardName: string;

  @property({
    type: 'string',
    required: true,
  })
  wardId: string;


  @property({
    type: 'string',
    required: true,
  })
  type: string;

  @property({
    type: 'boolean',
    required: true,
  })
  isDefault: boolean;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<LocationShop>) {
    super(data);
  }
}

export interface LocationShopRelations {
  // describe navigational properties here
}

export type LocationShopWithRelations = LocationShop & LocationShopRelations;
