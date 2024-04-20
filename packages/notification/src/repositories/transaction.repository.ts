import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {NotificationDataSource} from '../datasources';
import {Transaction, TransactionRelations} from '../models';

export class TransactionRepository extends DefaultCrudRepository<
  Transaction,
  typeof Transaction.prototype.id,
  TransactionRelations
> {
  constructor(
    @inject('datasources.notification') dataSource: NotificationDataSource,
  ) {
    super(Transaction, dataSource);
  }
}
