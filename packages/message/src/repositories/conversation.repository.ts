import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MessageDataSource} from '../datasources';
import {Conversation, ConversationRelations} from '../models';

export class ConversationRepository extends DefaultCrudRepository<
  Conversation,
  typeof Conversation.prototype.id,
  ConversationRelations
> {
  constructor(
    @inject('datasources.message') dataSource: MessageDataSource,
  ) {
    super(Conversation, dataSource);
  }
}
