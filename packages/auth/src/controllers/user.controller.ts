import {
  TokenService,
  UserService,
  authenticate,
} from '@loopback/authentication';
import {
  TokenServiceBindings,
  UserRepository,
} from '@loopback/authentication-jwt';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  Request,
  Response,
  RestBindings,
  get,
  getModelSchemaRef,
  post,
  requestBody,
  response,
} from '@loopback/rest';
import {SecurityBindings, UserProfile, securityId} from '@loopback/security';
import {UserServiceBindings} from '../keys';
import {Admin, User} from '../models';
import {Credentials} from '../types';
import {AdminRepository} from '../repositories';
import {AdminManagmentService} from '../services/adminManagement.service';
import multer from 'multer';
import {deleteRemoteFile, uploadFile} from '../config/firebaseConfig';

const storage = multer.memoryStorage();
const upload = multer({storage});

var cpUpload = upload.fields([{name: 'avatar'}, {name: 'coverImage'}]);
// upload img

export class UserManagementController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: UserService<User, any>,
    @repository(AdminRepository)
    public adminrepository: AdminRepository,
    @inject(UserServiceBindings.ADMIN_SERVICE)
    public adminService: AdminManagmentService,
    @inject(RestBindings.Http.RESPONSE)
    private response: Response,
  ) {}

  @authenticate('jwt')
  @post('/uploadAvatar')
  @response(200, {
    description: 'RequestCreateShop model instance',
    content: {
      'application/json': {schema: getModelSchemaRef(User)},
    },
  })
  async uploadAvatar(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
    @requestBody({
      description: 'multipart/form-data value.',
      required: true,
      content: {
        'multipart/form-data': {
          // Skip body parsing
          'x-parser': 'stream',
          schema: {type: 'object'},
        },
      },
    })
    request: Request,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise<any> {
    //
    const idOfUser = currentUserProfile.id;
    const role = currentUserProfile.role;

    const data: any = await new Promise<object>((resolve, reject) => {
      cpUpload(request, response, (err: unknown) => {
        if (err) reject(err);
        else {
          resolve({
            files: request.files,
            body: request.body,
          });
        }
      });
    });

    const avatar = data.files.avatar;

    if (avatar.length > 1) {
      return response.status(400).send('Chỉ được upload 1 ảnh dai dien');
    }

    if (role == 'customer') {
      const dataAvatar: any = await uploadFile(avatar[0]);

      await this.userRepository.updateById(idOfUser, {
        avatar: {
          filename: dataAvatar.filename,
          url: dataAvatar.url,
        },
      });
    }

    return this.userRepository.findById(idOfUser);
  }

  @authenticate('jwt')
  @post('/changeAvatar')
  @response(200, {
    description: 'RequestCreateShop model instance',
    content: {
      'application/json': {schema: getModelSchemaRef(User)},
    },
  })
  async changeAvatar(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
    @requestBody({
      description: 'multipart/form-data value.',
      required: true,
      content: {
        'multipart/form-data': {
          // Skip body parsing
          'x-parser': 'stream',
          schema: {type: 'object'},
        },
      },
    })
    request: Request,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise<any> {
    const idOfUser = currentUserProfile.id;
    const role = currentUserProfile.role;

    const oldAvatar = (await this.userRepository.findById(idOfUser)).avatar;

    deleteRemoteFile(oldAvatar.filename);

    const data: any = await new Promise<object>((resolve, reject) => {
      cpUpload(request, response, (err: unknown) => {
        if (err) reject(err);
        else {
          resolve({
            files: request.files,
            body: request.body,
          });
        }
      });
    });

    const avatar = data.files.avatar;

    if (avatar.length > 1) {
      return response.status(400).send('Chỉ được upload 1 ảnh dai dien');
    }

    if (role == 'customer') {
      const dataAvatar: any = await uploadFile(avatar[0]);

      await this.userRepository.updateById(idOfUser, {
        avatar: {
          filename: dataAvatar.filename,
          url: dataAvatar.url,
        },
      });
    }

    return this.userRepository.findById(idOfUser);
  }

  @authenticate('jwt')
  @post('/changeCoverImage')
  @response(200, {
    description: 'RequestCreateShop model instance',
    content: {
      'application/json': {schema: getModelSchemaRef(User)},
    },
  })
  async changeCoverImage(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
    @requestBody({
      description: 'multipart/form-data value.',
      required: true,
      content: {
        'multipart/form-data': {
          // Skip body parsing
          'x-parser': 'stream',
          schema: {type: 'object'},
        },
      },
    })
    request: Request,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise<any> {
    const idOfUser = currentUserProfile.id;
    const role = currentUserProfile.role;

    const oldCoverImage = (await this.userRepository.findById(idOfUser))
      .coverImage;

    deleteRemoteFile(oldCoverImage.filename);

    const data: any = await new Promise<object>((resolve, reject) => {
      cpUpload(request, response, (err: unknown) => {
        if (err) reject(err);
        else {
          resolve({
            files: request.files,
            body: request.body,
          });
        }
      });
    });

    const coverImage = data.files.coverImage;

    if (coverImage.length > 1) {
      return response.status(400).send('Chỉ được upload 1 ảnh dai dien');
    }

    if (role == 'customer') {
      const dataCoverImage: any = await uploadFile(coverImage[0]);

      await this.userRepository.updateById(idOfUser, {
        coverImage: {
          filename: dataCoverImage.filename,
          url: dataCoverImage.url,
        },
      });
    }

    return this.userRepository.findById(idOfUser);
  }

  @authenticate('jwt')
  @post('/uploadCoverImage')
  @response(200, {
    description: 'RequestCreateShop model instance',
    content: {
      'application/json': {schema: getModelSchemaRef(User)},
    },
  })
  async uploadCoverImg(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
    @requestBody({
      description: 'multipart/form-data value.',
      required: true,
      content: {
        'multipart/form-data': {
          // Skip body parsing
          'x-parser': 'stream',
          schema: {type: 'object'},
        },
      },
    })
    request: Request,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise<any> {
    const idOfUser = currentUserProfile.id;
    const role = currentUserProfile.role;

    const data: any = await new Promise<object>((resolve, reject) => {
      cpUpload(request, response, (err: unknown) => {
        if (err) reject(err);
        else {
          resolve({
            files: request.files,
            body: request.body,
          });
        }
      });
    });

    const coverImage = data.files.coverImage;

    if (coverImage.length > 1) {
      return response.status(400).send('Chỉ được upload 1 bia');
    }

    if (role == 'customer') {
      const dataCoverImage: any = await uploadFile(coverImage[0]);

      await this.userRepository.updateById(idOfUser, {
        coverImage: {
          filename: dataCoverImage.filename,
          url: dataCoverImage.url,
        },
      });
    }

    return this.userRepository.findById(idOfUser);
  }

  @post('/users/customer', {
    responses: {
      '200': {
        description: 'User',
        content: {
          'application/json': {
            schema: {
              'x-ts-type': User,
            },
          },
        },
      },
    },
  })
  async createCustomer(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'NewUser',
            exclude: ['id', 'role', 'isSeller'],
          }),
        },
      },
    })
    newUserRequest: Omit<User, 'id'>,
  ): Promise<any> {
    // All new users have the "customer" role by default
    newUserRequest.role = 'customer';
    newUserRequest.isSeller = false;

    try {
      if (
        (
          await this.userRepository.find({
            where: {email: newUserRequest.email},
          })
        ).length > 0
      ) {
        return this.response.status(400).send('Đã tồn tại email này rồi');
      }
      const data = await this.userRepository.create(newUserRequest);
      return data;
    } catch (error) {
      throw error;
    }
  }

  @post('/users/admin', {
    responses: {
      '200': {
        description: 'User',
        content: {
          'application/json': {
            schema: {
              'x-ts-type': User,
            },
          },
        },
      },
    },
  })
  async createAdmin(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Admin, {
            title: 'NewAdmin',
            exclude: ['id', 'role'],
          }),
        },
      },
    })
    newUserRequest: Omit<User, 'id'>,
  ): Promise<any> {
    // All new users have the "customer" role by default
    newUserRequest.role = 'admin';
    newUserRequest.permissions = 'all';

    try {
      const list = await this.userRepository.find({
        where: {email: newUserRequest.email},
      });
      if (list.length > 0) {
        return this.response.status(400).send('Đã tồn tại username này rồi');
      }
      const data = await this.adminrepository.create(newUserRequest);
      return data;
    } catch (error) {
      throw error;
    }
  }

  @post('/users/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async login(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              email: {
                type: 'string',
              },
              password: {
                type: 'string',
              },
            },
          },
        },
      },
    })
    credentials: Credentials,
  ): Promise<{token: string}> {
    // ensure the user exists, and the password is correct
    const user = await this.userService.verifyCredentials(credentials);

    // convert a User object into a UserProfile object (reduced set of properties)
    const userProfile = this.userService.convertToUserProfile(user);

    // create a JSON Web Token based on the user profile
    const token = await this.jwtService.generateToken(userProfile);

    return {token};
  }

  @post('/admin/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async loginAdmin(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              email: {
                type: 'string',
              },
              password: {
                type: 'string',
              },
            },
          },
        },
      },
    })
    credentials: Credentials,
  ): Promise<{token: string}> {
    // ensure the user exists, and the password is correct
    const user = await this.adminService.verifyCredentials(credentials);

    // convert a User object into a UserProfile object (reduced set of properties)
    const adminProfile = this.adminService.convertToUserProfile(user);

    // create a JSON Web Token based on the user profile
    const token = await this.jwtService.generateToken(adminProfile);

    return {token};
  }

  @authenticate('jwt')
  // @authorize({allowedRoles: ['admin'], voters: [basicAuthorization]})
  @get('whoAmI', {
    responses: {
      '200': {
        description: 'Return current user',
        content: {
          'application/json': {
            schema: {
              type: 'USER',
            },
          },
        },
      },
    },
  })
  async whoAmI(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<any> {
    if (currentUserProfile.role == 'admin') {
      return this.adminrepository.findById(currentUserProfile[securityId]);
    } else if (currentUserProfile.role == 'customer') {
      return this.userRepository.findById(currentUserProfile[securityId]);
    }
  }
}
