import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {NotificationDataSource} from '../datasources';
import {NotificationForShop, NotificationForShopRelations} from '../models';

export class NotificationForShopRepository extends DefaultCrudRepository<
  NotificationForShop,
  typeof NotificationForShop.prototype.id,
  NotificationForShopRelations
> {
  constructor(
    @inject('datasources.notification') dataSource: NotificationDataSource,
  ) {
    super(NotificationForShop, dataSource);
  }
}
