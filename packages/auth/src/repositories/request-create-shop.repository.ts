import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {AuthDataSource} from '../datasources';
import {RequestCreateShop, RequestCreateShopRelations} from '../models';

export class RequestCreateShopRepository extends DefaultCrudRepository<
  RequestCreateShop,
  typeof RequestCreateShop.prototype.id,
  RequestCreateShopRelations
> {
  constructor(
    @inject('datasources.auth') dataSource: AuthDataSource,
  ) {
    super(RequestCreateShop, dataSource);
  }
}
