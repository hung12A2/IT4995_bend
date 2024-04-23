

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

  export const EMPLOYEE_SERVICE = BindingKey.create<UserService<any,any >> (
    'services.employee.services'
  )
}
