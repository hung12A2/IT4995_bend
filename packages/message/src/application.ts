import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {SocketIoApplication} from '@loopback/socketio';
import debugFactory from 'debug';
import {SocketIoController} from './controllers/socketio.controller';
import { RepositoryMixin } from '@loopback/repository';
import { ServiceMixin } from '@loopback/service-proxy';

const debug = debugFactory('loopback:example:socketio:demo');

export {ApplicationConfig};

export class MessageApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(SocketIoApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);


    this.projectRoot = __dirname;

    this.socketServer.use((socket, next) => {
      debug('Global middleware - socket:', socket.id);
      next();
    });

    const ns = this.socketServer.route(SocketIoController);
    ns.use((socket, next) => {
      debug(
        'Middleware for namespace %s - socket: %s',
        socket.nsp.name,
        socket.id,
      );
      next();
    });

    // Customize @loopback/boot Booter Conventions her
  }
}
