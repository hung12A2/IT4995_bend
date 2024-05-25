import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {StoreDataSource} from '../datasources';
import {Search, SearchRelations} from '../models';

export class SearchRepository extends DefaultCrudRepository<
  Search,
  typeof Search.prototype.id,
  SearchRelations
> {
  constructor(
    @inject('datasources.store') dataSource: StoreDataSource,
  ) {
    super(Search, dataSource);
  }
}
