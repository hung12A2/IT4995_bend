// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {UserService} from '@loopback/authentication';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';
import {Employee} from '../models';
import {EmployeeRepository} from '../repositories';
import {CredentialsForEmployee} from '../types';

export class EmployeeManagmentService implements UserService<Employee, CredentialsForEmployee> {
  constructor(

    @repository(EmployeeRepository)
    public employeeRepository: EmployeeRepository,
  ) {}

  async verifyCredentials(credentials: CredentialsForEmployee): Promise<Employee> {
    const {username, password} = credentials;
    const invalidCredentialsError = 'Invalid email or password.';

    if (!username) {
      throw new HttpErrors.Unauthorized(invalidCredentialsError);
    }
    const foundUser = await this.employeeRepository.findOne({
      where: {username},
    });

    if (foundUser?.password !== password)
      throw new HttpErrors.Unauthorized(invalidCredentialsError);

    if (!foundUser) {
      throw new HttpErrors.Unauthorized(invalidCredentialsError);
    }

    return foundUser;
  }

  convertToUserProfile(employee: Employee): UserProfile {
    if (employee.id) {
      return {
        [securityId]: employee.id,
        id: employee.id,
        role: employee.role,
        permissions: employee.permissions,
        status: employee.status,
        idOfShop: employee.idOfShop,
        idOfKiot: employee.idOfKiot,
      };
    } else
      return {
        [securityId]: '',
        id: employee.id,
        role: employee.role,
        permissions: employee.permissions,
        status: employee.status,
        idOfShop: employee.idOfShop,
        idOfKiot: employee.idOfKiot,
      };
  }
}
