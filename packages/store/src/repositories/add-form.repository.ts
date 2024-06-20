import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {StoreDataSource} from '../datasources';
import {AddForm, AddFormRelations} from '../models';

export class AddFormRepository extends DefaultCrudRepository<
  AddForm,
  typeof AddForm.prototype.id,
  AddFormRelations
> {
  constructor(
    @inject('datasources.store') dataSource: StoreDataSource,
  ) {
    super(AddForm, dataSource);
  }
}
