// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {
  AuthorizationContext,
  AuthorizationDecision,
  AuthorizationMetadata,
} from '@loopback/authorization';

// Instance level authorizer
// Can be also registered as an authorizer, depends on users' need.
export async function basicAuthorization(
  authorizationCtx: AuthorizationContext,
  metadata: AuthorizationMetadata,
): Promise<AuthorizationDecision> {
  // No access if authorization details are missing
  let currentUser: any;
  if (authorizationCtx.principals.length > 0) {
    currentUser = authorizationCtx.principals[0];
  } else {
    return AuthorizationDecision.DENY;
  }

  const allowedRoles = metadata.allowedRoles;
  const per = currentUser.permissions;
  const permissionsOfUser = per ? per : '';

  let role;
  let permission;

  if (allowedRoles) {
    role = allowedRoles[0];
    permission = allowedRoles.slice(1);
  }

  let check = true;

  if (permissionsOfUser !== 'all' && !permissionsOfUser) {
    const listPermissionsOfUser = permissionsOfUser.split('|');
    permission?.forEach((element: string) => {
      if (!listPermissionsOfUser.includes(element)) {
        check = false;
      }
    });
  }

  if (!check) {
    return AuthorizationDecision.DENY;
  }

  if (!currentUser.role) {
    return AuthorizationDecision.DENY;
  }

  if (!metadata.allowedRoles) {
    return AuthorizationDecision.ALLOW;
  }

  let roleIsAllowed = false;
  if (metadata.allowedRoles!.includes(currentUser.role)) {
    roleIsAllowed = true;
  }

  if (!roleIsAllowed) {
    return AuthorizationDecision.DENY;
  }

  return AuthorizationDecision.ALLOW;
}
