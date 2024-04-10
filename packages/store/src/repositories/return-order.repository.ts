import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {StoreDataSource} from '../datasources';
import {ReturnOrder, ReturnOrderRelations} from '../models';

export class ReturnOrderRepository extends DefaultCrudRepository<
  ReturnOrder,
  typeof ReturnOrder.prototype.id,
  ReturnOrderRelations
> {
  constructor(
    @inject('datasources.store') dataSource: StoreDataSource,
  ) {
    super(ReturnOrder, dataSource);
  }
}
