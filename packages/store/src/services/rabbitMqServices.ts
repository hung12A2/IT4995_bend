import * as amqp from 'amqplib/callback_api';

export class RabbitMQService {
  private static instance: RabbitMQService;
  private channel: amqp.Channel;

  private constructor() {
    amqp.connect('amqp://guest:guest@localhost', (error0, connection) => {
      if (error0) {
        throw error0;
      }
      connection.createChannel((error1, channel) => {
        if (error1) {
          throw error1;
        }

        this.channel = channel;
      });
    });
  }

  public static getInstance(): RabbitMQService {
    if (!RabbitMQService.instance) {
      RabbitMQService.instance = new RabbitMQService();
    }

    return RabbitMQService.instance;
  }

  public sendMessageToTopicExchange(exchange: string, routingKey: string, msg: string): void {
    this.channel.assertExchange(exchange, 'topic', {
      durable: false,      
    });

    this.channel.publish(exchange, routingKey, Buffer.from(msg));

    console.log(` [x] Sent ${routingKey}:${msg}`);
  }
}
