import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {StoreDataSource} from '../datasources';
import {BoughtProduct, BoughtProductRelations} from '../models';

export class BoughtProductRepository extends DefaultCrudRepository<
  BoughtProduct,
  typeof BoughtProduct.prototype.id,
  BoughtProductRelations
> {
  constructor(
    @inject('datasources.store') dataSource: StoreDataSource,
  ) {
    super(BoughtProduct, dataSource);
  }
}
