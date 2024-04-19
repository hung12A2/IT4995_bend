import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {AuthDataSource} from '../datasources';
import {Kiot, KiotRelations} from '../models';

export class KiotRepository extends DefaultCrudRepository<
  Kiot,
  typeof Kiot.prototype.id,
  KiotRelations
> {
  constructor(
    @inject('datasources.auth') dataSource: AuthDataSource,
  ) {
    super(Kiot, dataSource);
  }
}
