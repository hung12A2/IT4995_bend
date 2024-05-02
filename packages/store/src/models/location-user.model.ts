import {Entity, model, property} from '@loopback/repository';

@model({settings: {}})
export class LocationUser extends Entity {
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
  idOfUser: string;

  @property({
    type: 'string',
    required: true,
  })
  address: string;

  @property({
    type: 'object',
    required: true,
  })
  geometry: object;

  @property({
    type: 'boolean',
    required: false,
    default: false,
  })
  isDefaultOnline: boolean;

  @property({
    type: 'boolean',
    required: false,
    default: false,
  })
  isDefaultKiot: boolean;

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

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<LocationUser>) {
    super(data);
  }
}

export interface LocationUserRelations {
  // describe navigational properties here
}

export type LocationUserWithRelations = LocationUser & LocationUserRelations;
