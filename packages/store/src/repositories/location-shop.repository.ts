import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {StoreDataSource} from '../datasources';
import {LocationShop, LocationShopRelations} from '../models';

export class LocationShopRepository extends DefaultCrudRepository<
  LocationShop,
  typeof LocationShop.prototype.id,
  LocationShopRelations
> {
  constructor(
    @inject('datasources.store') dataSource: StoreDataSource,
  ) {
    super(LocationShop, dataSource);
  }
}
