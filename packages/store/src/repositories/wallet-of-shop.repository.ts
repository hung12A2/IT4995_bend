import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {StoreDataSource} from '../datasources';
import {WalletOfShop, WalletOfShopRelations} from '../models';

export class WalletOfShopRepository extends DefaultCrudRepository<
  WalletOfShop,
  typeof WalletOfShop.prototype.id,
  WalletOfShopRelations
> {
  constructor(
    @inject('datasources.store') dataSource: StoreDataSource,
  ) {
    super(WalletOfShop, dataSource);
  }
}
