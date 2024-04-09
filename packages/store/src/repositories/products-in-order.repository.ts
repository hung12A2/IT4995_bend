import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {StoreDataSource} from '../datasources';
import {ProductsInOrder, ProductsInOrderRelations} from '../models';

export class ProductsInOrderRepository extends DefaultCrudRepository<
  ProductsInOrder,
  typeof ProductsInOrder.prototype.id,
  ProductsInOrderRelations
> {
  constructor(
    @inject('datasources.store') dataSource: StoreDataSource,
  ) {
    super(ProductsInOrder, dataSource);
  }
}
