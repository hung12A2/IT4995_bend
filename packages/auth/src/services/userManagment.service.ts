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

export class UserManagementService implements UserService<User, Credentials> {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(AdminRepository)
    public adminRepository: AdminRepository,
  ) {}

  async verifyCredentials(credentials: Credentials): Promise<User> {
    const {email, password} = credentials;
    const invalidCredentialsError = 'Invalid email or password.';

    if (!email) {
      throw new HttpErrors.Unauthorized(invalidCredentialsError);
    }
    const foundUser = await this.userRepository.findOne({
      where: {email},
    });

    if (foundUser?.password !== password)
      throw new HttpErrors.Unauthorized(invalidCredentialsError);

    if (!foundUser) {
      throw new HttpErrors.Unauthorized(invalidCredentialsError);
    }

    return foundUser;
  }

  convertToUserProfile(user: User): UserProfile {
    // since first name and lastName are optional, no error is thrown if not provided
    if (user.id) {
      return {
        [securityId]: user.id,
        fullname: user.fullName,
        gender: user.gender,
        phonenumber: user.phoneNumber,
        email: user.email,
        id: user.id,
        role: user.role,
        status: user.status,
      };
    } else
      return {
        [securityId]: '',
        fullname: user.fullName,
        email: user.email,
        gender: user.gender,
        phonenumber: user.phoneNumber,
        id: user.id,
        role: user.role,
        status: user.status,
      };
  }
}
