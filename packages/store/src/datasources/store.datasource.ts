import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

// const config = {
//   name: 'store',
//   connector: 'memory',
//   localStorage: '',
//   file: './src/data/db.json',
// };

// const config = {
//   name: 'store',
//   connector: 'postgresql',
//   host: 'localhost',
//   port: 5432,
//   user: 'postgres',
//   password: 'postgres',
//   database: 'shopstore',

// };

const config = {
  name: 'store',
  connector: 'postgresql',
  host: 'dpg-coq7gmv79t8c738b8l1g-a.singapore-postgres.render.com',
  port: 5432,
  user: 'hungnguyen',
  password: 'tgPnxt2vabQg66kLQ2HyDf0pSSN8jAlq',
  database: 'shopstore_2puh',
  ssl: {
    rejectUnauthorized: false,
  },
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class StoreDataSource
  extends juggler.DataSource
  implements LifeCycleObserver
{
  static dataSourceName = 'store';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.store', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
