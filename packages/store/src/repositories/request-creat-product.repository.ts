import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {StoreDataSource} from '../datasources';
import {RequestCreateProduct, RequestCreateProductRelations} from '../models';

export class RequestCreatProductRepository extends DefaultCrudRepository<
  RequestCreateProduct,
  typeof RequestCreateProduct.prototype.id,
  RequestCreateProductRelations
> {
  constructor(
    @inject('datasources.store') dataSource: StoreDataSource,
  ) {
    super(RequestCreateProduct, dataSource);
  }
}
