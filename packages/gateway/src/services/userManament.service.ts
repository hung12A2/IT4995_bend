// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {UserService} from '@loopback/authentication';
import {securityId, UserProfile} from '@loopback/security';
import {Credentials} from '../types';
import axios from 'axios';
import {HttpErrors} from '@loopback/rest';

export class UserManagementService implements UserService<any, any> {
  constructor() {}

  async verifyCredentials(credentials: Credentials): Promise<any> {
    const {email, password} = credentials;
    const data = await axios
      .post(`http://localhost:8080/getInfoByPass/customer`, {
        email,
        password,
      })
      .then(res => res.data);

    if (data) return data;
    else throw new HttpErrors.Unauthorized('Invalid email or password');
  }

  convertToUserProfile(user: any): UserProfile {
    delete user.password;
    // since first name and lastName are optional, no error is thrown if not provided
    if (user.id) {
      return {
        [securityId]: user.id,
        ...user,
      };
    } else
      return {
        [securityId]: '',
        ...user,
      };
  }
}
