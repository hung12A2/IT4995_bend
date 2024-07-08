import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {MySequence} from './sequence';
import {RabbitMQService} from './services/rabbitMQService';
import {NotificationRepository} from './repositories/notification.repository';
import {
  NotificationForShopRepository,
  TransactionRepository,
  TransactionShopRepository,
} from './repositories';

export {ApplicationConfig};

export class NotificaitonApllication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    RabbitMQService.getInstance();

    this.startRabbit();

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }

  public async startRabbit() {
    const newRabbitMQService = RabbitMQService.getInstance();
    newRabbitMQService.consumeFromTopicExchange(
      'notification',
      'create',
      async msg => {
        const data = JSON.parse(msg.content.toString());
        const notificationRepository = await this.getRepository(
          NotificationRepository,
        );
        const check = await notificationRepository.findOne({
          where: {idOfOrder: data?.idOfOrder, title: {
            like: 'Nap tien'
          }},
        });
        if (check) {
          return;
        }
        const data2 = await notificationRepository.create(data);
        console.log(data2);
      },
    );

    newRabbitMQService.consumeFromTopicExchange(
      'notificationForShop',
      'create',
      async msg => {
        const data = JSON.parse(msg.content.toString());
        const notificationRepository = await this.getRepository(
          NotificationForShopRepository,
        );
        const data2 = await notificationRepository.create(data);
        console.log(data2);
      },
    );

    newRabbitMQService.consumeFromTopicExchange(
      'transaction',
      'create',
      async msg => {
        const data = JSON.parse(msg.content.toString());
        const transactionRepository = await this.getRepository(
          TransactionRepository,
        );
        const check = await transactionRepository.findOne({
          where: {idOfOrder: data?.idOfOrder, type: 'charge'},
        });
        if (check) {
          return;
        }
        const data2 = await transactionRepository.create(data);

        console.log(data2);
      },
    );

    newRabbitMQService.consumeFromTopicExchange(
      'transactionForShop',
      'create',
      async msg => {
        const data = JSON.parse(msg.content.toString());
        const notificationRepository = await this.getRepository(
          TransactionShopRepository,
        );
        const data2 = await notificationRepository.create(data);
        console.log(data2);
      },
    );
  }
}
