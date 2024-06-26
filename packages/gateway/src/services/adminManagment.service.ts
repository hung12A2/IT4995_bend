// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {UserService} from '@loopback/authentication';
import {securityId, UserProfile} from '@loopback/security';
import {Credentials} from '../types';
import axios from '../services/authAxios.service';

export class AdminManagementService implements UserService<any, any> {
  constructor() {}

  async verifyCredentials(credentials: Credentials): Promise<any> {
    const {email, password} = credentials;
    const data = await axios
      .post(`login/Admin`, {
        email,
        password,
      })
      .then((res:any) => res.token)
      .catch(e => console.log(e));

    if (data) return data;
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
