import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {StoreDataSource} from '../datasources';
import {ProductInAddForm, ProductInAddFormRelations} from '../models';

export class ProductInAddFormRepository extends DefaultCrudRepository<
  ProductInAddForm,
  typeof ProductInAddForm.prototype.id,
  ProductInAddFormRelations
> {
  constructor(
    @inject('datasources.store') dataSource: StoreDataSource,
  ) {
    super(ProductInAddForm, dataSource);
  }
}
