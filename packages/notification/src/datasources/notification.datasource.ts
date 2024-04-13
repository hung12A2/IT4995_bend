import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

// const config = {
//   name: 'notification',
//   connector: 'postgresql',
//   url: '',
//   host: '',
//   port: 0,
//   user: '',
//   password: '',
//   database: ''
// };

const config = {
  name: 'notification',
  connector: 'memory',
  localStorage: './data/db.json',
  file: './src/data/db.json',
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class NotificationDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'notification';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.notification', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
