// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {UserService} from '@loopback/authentication';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';
import {Admin, User} from '../models';
import {AdminRepository, UserRepository} from '../repositories';
import {Credentials} from '../types';

export class AdminManagmentService implements UserService<Admin, Credentials> {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(AdminRepository)
    public adminRepository: AdminRepository,
  ) {}

  async verifyCredentials(credentials: Credentials): Promise<Admin> {
    const {email, password} = credentials;
    const invalidCredentialsError = 'Invalid email or password.';

    if (!email) {
      throw new HttpErrors.Unauthorized(invalidCredentialsError);
    }
    const foundUser = await this.adminRepository.findOne({
      where: {email},
    });

    if (foundUser?.password !== password)
      throw new HttpErrors.Unauthorized(invalidCredentialsError);

    if (!foundUser) {
      throw new HttpErrors.Unauthorized(invalidCredentialsError);
    }

    return foundUser;
  }

  convertToUserProfile(admin: Admin): any {
    if (admin.id) {
      return {
        [securityId]: admin.id,
        ...admin,
      };
    } else
      return {
        [securityId]: '',
        ...admin,
      };
  }
}
