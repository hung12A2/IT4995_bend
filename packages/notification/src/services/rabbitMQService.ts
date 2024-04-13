import * as amqp from 'amqplib/callback_api';

export class RabbitMQService {
  private static instance: RabbitMQService;
  private channel: amqp.Channel;
  private connectionPromise: Promise<void>;

  private constructor() {
    this.connectionPromise = new Promise((resolve, reject) => {
      amqp.connect('amqp://guest:guest@localhost', (error0, connection) => {
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

  public static getInstance(): RabbitMQService {
    if (!RabbitMQService.instance) {
      RabbitMQService.instance = new RabbitMQService();
    }
    return RabbitMQService.instance;
  }

  public async sendMessageToTopicExchange(exchange: string, routingKey: string, msg: string): Promise<void> {
    await this.connectionPromise;
    this.channel.assertExchange(exchange, 'topic', {
      durable: false,
    });

    this.channel.publish(exchange, routingKey, Buffer.from(msg));

    console.log(` [x] Sent ${routingKey}:${msg}`);
  }

  public consumeFromTopicExchange(exchange: string, routingKey: string, callback: (msg: amqp.Message) => void): void {
    this.connectionPromise.then(() => {
      this.channel.assertExchange(exchange, 'topic', {
        durable: false,
      });

      this.channel.assertQueue('', { exclusive: true }, (error2, q) => {
        if (error2) {
          throw error2;
        }

        this.channel.bindQueue(q.queue, exchange, routingKey);

        this.channel.consume(q.queue, (msg) => {
          if (msg) {
            callback(msg);
            this.channel.ack(msg);
          }
        });
      });
    });
  }
}