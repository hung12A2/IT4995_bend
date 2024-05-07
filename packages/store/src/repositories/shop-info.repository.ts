import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {StoreDataSource} from '../datasources';
import {ShopInfo, ShopInfoRelations} from '../models';

export class ShopInfoRepository extends DefaultCrudRepository<
  ShopInfo,
  typeof ShopInfo.prototype.id,
  ShopInfoRelations
> {
  constructor(
    @inject('datasources.store') dataSource: StoreDataSource,
  ) {
    super(ShopInfo, dataSource);
  }
}
