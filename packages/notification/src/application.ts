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
    newRabbitMQService.consumeFromTopicExchange('order', 'add', async msg => {
      const data = JSON.parse(msg.content.toString());
      if (!data.isViewed) {
        data.isViewed = false;
      }
      const notificationRepository =await this.getRepository(NotificationRepository);
      const data2 = await notificationRepository.create(data);
      console.log (data2)
    });
  }
}
