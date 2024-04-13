import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {StoreDataSource} from '../datasources';
import {RatingProduct, RatingProductRelations} from '../models';

export class RatingProductRepository extends DefaultCrudRepository<
  RatingProduct,
  typeof RatingProduct.prototype.id,
  RatingProductRelations
> {
  constructor(
    @inject('datasources.store') dataSource: StoreDataSource,
  ) {
    super(RatingProduct, dataSource);
  }
}
