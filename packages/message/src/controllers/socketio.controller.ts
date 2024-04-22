// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @loopback/example-socketio
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {Socket, socketio} from '@loopback/socketio';
import debugFactory from 'debug';
import {ConversationRepository, MessageRepository} from '../repositories';
import {repository} from '@loopback/repository';

/**
 * A demo controller for socket.io
 *
 * ```ts
 * @socketio('/')
 * ```
 * This specifies the namespace / for this controller
 * Regex or strings are acceptable values for namespace
 */
@socketio('/')
export class SocketIoController {
  constructor(
    @repository(ConversationRepository)
    public conversationRepository: ConversationRepository,
    @repository(MessageRepository)
    public messageRepository: MessageRepository,
    @socketio.socket() // Equivalent to `@inject('ws.socket')`
    private socket: Socket,
  ) {}

  /**
   * The method is invoked when a client connects to the server
   *
   * @param socket - The socket object for client
   */
  @socketio.connect()
  connect(socket: Socket) {
    console.log(`connect room ${this.socket.id}`);
  }

  /**
   * Register a handler for 'subscribe-to-channel' events
   *
   * @param msg - The message sent by client
   */
  @socketio.subscribe('joinConversation')
  // @socketio.emit('namespace' | 'requestor' | 'broadcast')
  async joinConversation(data: any) {
    const {idOfUser, idOfShop} = data;
    const conversationId = `idOfUser-${idOfUser}-idOfShop-${idOfShop}`;
    this.socket.join(conversationId);
    const conversation = await this.conversationRepository.findOne({
      where: {idOfUser, idOfShop},
    });
    if (conversation == null) {
      await this.conversationRepository.create({
        idOfUser,
        idOfShop,
        createdAt: new Date().toISOString(),
      });
      console.log('created conversation', conversationId);
    }

    console.log ('joinConversation', conversationId);
  }

  @socketio.subscribe('add-msg')
  // @socketio.emit('namespace' | 'requestor' | 'broadcast')
  async addMsg(data: any) {
    const {idOfUser, idOfShop, content, imgLink, senderId, targetId} = data;
    const conversationId = `idOfUser-${idOfUser}-idOfShop-${idOfShop}`;
    await this.messageRepository.create({
      idOfShop,
      idOfUser,
      senderId,
      targetId,
      content,
      imgLink,
      createdAt: new Date().toISOString(),
    });

    await this.conversationRepository.updateAll(
      {lastMsg: content ? content.substring(0, 20) : ''},
      {idOfUser, idOfShop},
    );

    this.socket.nsp.to(conversationId).emit(
      'server-send-msg',
      JSON.stringify({
        senderId,
        targetId,
        content,
        imgLink: imgLink ? imgLink : '',
      }),
    );
  }

  @socketio.subscribe('list-msg')
  // @socketio.emit('namespace' | 'requestor' | 'broadcast')
  async listMsg(data: any) {
    const {idOfUser, idOfShop, limitmsg} = data;
    const msgData = await this.messageRepository.find({
      order: ['createdAt DESC'],
      limit: limitmsg,
      where: {idOfUser, idOfShop},
      
    });
    console.log('list-msg', msgData);
    this.socket.nsp
      .to(`idOfUser-${idOfUser}-idOfShop-${idOfShop}`)
      .emit('server-list-msg', JSON.stringify(msgData));
  }

  /**
   * Register a handler for 'general-message-forward' events
   *
   * @param msg - The message sent by client
   */
  @socketio.subscribe('general-message-forward')
  // @socketio.emit('namespace' | 'requestor' | 'broadcast')
  handleChatMessage(msg: unknown) {
    this.socket.nsp.emit('general-message-forward', msg);
  }

  /**
   * Register a handler for 'general-message' events
   *
   * @param msg - The message sent by client
   */
  @socketio.subscribe('general-message')
  // @socketio.emit('namespace' | 'requestor' | 'broadcast')
  handleGeneralMessage(msg: string) {
    const parsedMsg: {
      subject: string;
      body: string;
      receiver: {
        to: {
          id: string;
          name?: string;
        }[];
      };
      type: string;
      sentDate: Date;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      options?: any;
    } = JSON.parse(msg);

    if (parsedMsg?.receiver?.to?.length > 0) {
      parsedMsg.receiver.to.forEach(item =>
        this.socket.nsp.to(item.id).emit('message', {
          subject: parsedMsg.subject,
          body: parsedMsg.body,
          options: parsedMsg.options,
        }),
      );
    } else {
      throw new Error('Inappropriate message data');
    }
  }

  /**
   * Register a handler for all events
   */
  @socketio.subscribe(/.+/)
  logMessage(...args: unknown[]) {}

  /**
   * The method is invoked when a client disconnects from the server
   * @param socket
   */
  @socketio.disconnect()
  disconnect() {
    console.log('disconnect room 1');
  }
}
