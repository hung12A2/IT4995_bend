import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {AuthDataSource} from '../datasources';
import {Area, AreaRelations} from '../models';

export class AreaRepository extends DefaultCrudRepository<
  Area,
  typeof Area.prototype.id,
  AreaRelations
> {
  constructor(
    @inject('datasources.auth') dataSource: AuthDataSource,
  ) {
    super(Area, dataSource);
  }
}
