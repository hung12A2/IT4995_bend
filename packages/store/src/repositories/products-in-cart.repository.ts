import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {StoreDataSource} from '../datasources';
import {ProductsInCart, ProductsInCartRelations} from '../models';

export class ProductsInCartRepository extends DefaultCrudRepository<
  ProductsInCart,
  typeof ProductsInCart.prototype.id,
  ProductsInCartRelations
> {
  constructor(
    @inject('datasources.store') dataSource: StoreDataSource,
  ) {
    super(ProductsInCart, dataSource);
  }
}
