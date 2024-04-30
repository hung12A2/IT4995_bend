import * as amqp from 'amqplib/callback_api';

export class RabbitMQService {
  private static instance: RabbitMQService;
  public channel: amqp.Channel;

  private constructor() {}

  public async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      amqp.connect('amqps://azkluhud:OXbmo02ei30tCDMbrE8DJjn2wK60WZTo@armadillo.rmq.cloudamqp.com/azkluhud', (error0, connection) => {
        if (error0) {
          reject(error0);
        }

        connection.createChannel((error1, channel) => {
          if (error1) {
            reject(error1);
          }

          this.channel = channel;
          resolve();
        });
      });
    });
  }

  public static async getInstance(): Promise<RabbitMQService> {
    if (!RabbitMQService.instance) {
      RabbitMQService.instance = new RabbitMQService();
      await RabbitMQService.instance.init();
    }

    return RabbitMQService.instance;
  }

  public setupTopicExchange(exchange: string): void {
    this.channel.assertExchange(exchange, 'topic', {
      durable: false,
    });
  }

  public sendMessageToTopicExchange(
    exchange: string,
    routingKey: string,
    msg: string,
  ): void {
    this.channel.publish(exchange, routingKey, Buffer.from(msg));

    console.log(` [x] Sent ${routingKey}:${msg}`);
  }
}
