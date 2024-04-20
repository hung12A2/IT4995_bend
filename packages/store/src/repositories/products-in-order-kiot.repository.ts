import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {StoreDataSource} from '../datasources';
import {ProductsInOrderKiot, ProductsInOrderKiotRelations} from '../models';

export class ProductsInOrderKiotRepository extends DefaultCrudRepository<
  ProductsInOrderKiot,
  typeof ProductsInOrderKiot.prototype.id,
  ProductsInOrderKiotRelations
> {
  constructor(
    @inject('datasources.store') dataSource: StoreDataSource,
  ) {
    super(ProductsInOrderKiot, dataSource);
  }
}
