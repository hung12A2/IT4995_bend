import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {StoreDataSource} from '../datasources';
import {LocationUser, LocationUserRelations} from '../models';

export class LocationUserRepository extends DefaultCrudRepository<
  LocationUser,
  typeof LocationUser.prototype.id,
  LocationUserRelations
> {
  constructor(
    @inject('datasources.store') dataSource: StoreDataSource,
  ) {
    super(LocationUser, dataSource);
  }
}
