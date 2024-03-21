import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {AuthDataSource} from '../datasources';
import {Store, StoreRelations} from '../models';

export class StoreRepository extends DefaultCrudRepository<
  Store,
  typeof Store.prototype.id,
  StoreRelations
> {
  constructor(
    @inject('datasources.auth') dataSource: AuthDataSource,
  ) {
    super(Store, dataSource);
  }
}
