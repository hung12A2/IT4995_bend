import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {NotificationDataSource} from '../datasources';
import {TransactionShop, TransactionShopRelations} from '../models';

export class TransactionShopRepository extends DefaultCrudRepository<
  TransactionShop,
  typeof TransactionShop.prototype.id,
  TransactionShopRelations
> {
  constructor(
    @inject('datasources.notification') dataSource: NotificationDataSource,
  ) {
    super(TransactionShop, dataSource);
  }
}
