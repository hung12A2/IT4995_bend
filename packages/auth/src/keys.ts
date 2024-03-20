// Copyright IBM Corp. 2019,2020. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {UserService} from '@loopback/authentication';
import {BindingKey} from '@loopback/context';

export namespace PasswordHasherBindings {
  export const ROUNDS = BindingKey.create<number>('services.hasher.round');
}

export namespace UserServiceBindings {
  export const USER_SERVICE = BindingKey.create<UserService<any, any>>(
    'services.user.service',
  );

  export const ADMIN_SERVICE = BindingKey.create<UserService<any,any >> (
    'services.admin.services'
  )
}
