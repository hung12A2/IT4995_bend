import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {StoreDataSource} from '../datasources';
import {OrderKiot, OrderKiotRelations} from '../models';

export class OrderKiotRepository extends DefaultCrudRepository<
  OrderKiot,
  typeof OrderKiot.prototype.id,
  OrderKiotRelations
> {
  constructor(
    @inject('datasources.store') dataSource: StoreDataSource,
  ) {
    super(OrderKiot, dataSource);
  }
}
