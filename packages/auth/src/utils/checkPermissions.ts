export const checkPermission = (
    permissions: string,
    userPermissions: string
  ) => {
    if (userPermissions == "all") return true;
    else {
      return userPermissions?.includes(permissions);
    }
  };