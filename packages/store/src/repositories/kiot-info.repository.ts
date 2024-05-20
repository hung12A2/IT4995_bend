import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {StoreDataSource} from '../datasources';
import {KiotInfo, KiotInfoRelations} from '../models';

export class KiotInfoRepository extends DefaultCrudRepository<
  KiotInfo,
  typeof KiotInfo.prototype.id,
  KiotInfoRelations
> {
  constructor(
    @inject('datasources.store') dataSource: StoreDataSource,
  ) {
    super(KiotInfo, dataSource);
  }
}
