import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'auth',
  connector: 'memory',
  localStorage: './data/db.json',
  file: './src/data/db.json',
};

// const config = {
//   name: 'auth',
//   connector: 'postgresql',
//   host: 'dpg-coo805uv3ddc738id2f0-a.singapore-postgres.render.com',
//   port: 5432,
//   user: 'hungnguyen',
//   password: 'AJHiXkPCsTlYiTymMHEEMyhCX7hDcyRb',
//   database: 'shopauth',
//   ssl: {
//     rejectUnauthorized: false,
//   },
// };

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class AuthDataSource
  extends juggler.DataSource
  implements LifeCycleObserver
{
  static dataSourceName = 'auth';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.auth', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
