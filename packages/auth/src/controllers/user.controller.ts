import {
  TokenService,
  UserService,
  authenticate,
} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {
  TokenServiceBindings,
  UserRepository,
} from '@loopback/authentication-jwt';
import {inject} from '@loopback/core';
import {Filter, property, repository} from '@loopback/repository';
import {
  HttpErrors,
  Request,
  Response,
  RestBindings,
  get,
  getModelSchemaRef,
  param,
  post,
  requestBody,
  response,
} from '@loopback/rest';
import {SecurityBindings, UserProfile, securityId} from '@loopback/security';
import {UserServiceBindings} from '../keys';
import {Admin, User} from '../models';
import {Credentials, CredentialsForEmployee} from '../types';
import {AdminRepository, EmployeeRepository, KiotRepository, StoreRepository} from '../repositories';
import {AdminManagmentService} from '../services/adminManagement.service';
import multer from 'multer';
import {deleteRemoteFile, uploadFile} from '../config/firebaseConfig';
import nodemailer from 'nodemailer';
import {promisify} from 'util';
import {basicAuthorization} from '../services/basicAuthorize';
import {generateRandomString} from '../utils/genString';
import {sendEmail} from '../utils/sendMail';

const jwt = require('jsonwebtoken');
const signAsync = promisify(jwt.sign);
const verifyAsync = promisify(jwt.verify);

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
    @repository(EmployeeRepository)
    public employeeRepository: EmployeeRepository,
    @inject(UserServiceBindings.ADMIN_SERVICE)
    public adminService: AdminManagmentService,
    @inject(UserServiceBindings.EMPLOYEE_SERVICE)
    public employeeService: UserService<Admin, any>,
    @inject(RestBindings.Http.RESPONSE)
    private response: Response,
    @repository(StoreRepository)
    public storeRepository: StoreRepository,
    @repository(KiotRepository)
    public kiotRepository: KiotRepository,
  ) {}

  //
  @authenticate('jwt')
  @post('/uploadAvatar/user')
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

    if (role == 'customer') {
      const oldUser: any = await this.userRepository.findById(idOfUser);

      const avatar = data.files.avatar;

      if (avatar.length > 1) {
        return {
          code: 400,
          message: 'Chỉ được upload 1 ảnh dai dien',
        };
      }
      const dataAvatar: any = await uploadFile(avatar[0]);

      await this.userRepository.updateById(idOfUser, {
        avatar: {
          filename: dataAvatar?.filename,
          url: dataAvatar?.url,
        },
      });

      const dataImg = await this.userRepository.findById(idOfUser);
      if (oldUser?.avatar?.url) {
        deleteRemoteFile(oldUser?.avatar.filename);
        return {code: 200, data: dataImg};
      }
      return {code: 200, data: dataImg};
    }

    if (role == 'admin') {
      const oldUser: any = await this.adminrepository.findById(idOfUser);

      const avatar = data.files.avatar;

      if (avatar.length > 1) {
        return {
          code: 400,
          message: 'Chỉ được upload 1 ảnh dai dien',
        };
      }
      const dataAvatar: any = await uploadFile(avatar[0]);

      await this.adminrepository.updateById(idOfUser, {
        avatar: {
          filename: dataAvatar.filename,
          url: dataAvatar.url,
        },
      });

      const dataImg = await this.adminrepository.findById(idOfUser);
      if (oldUser.avatar.url) {
        deleteRemoteFile(oldUser.avatar.filename);
      }
      return {code: 200, data: dataImg};
    }

    if (role == 'employee') {
      const oldUser: any = await this.employeeRepository.findById(idOfUser);

      const avatar = data.files.avatar;

      if (avatar.length > 1) {
        return {
          code: 400,
          message: 'Chỉ được upload 1 ảnh dai dien',
        };
      }

      const dataAvatar: any = await uploadFile(avatar[0]);

      await this.employeeRepository.updateById(idOfUser, {
        avatar: {
          filename: dataAvatar.filename,
          url: dataAvatar.url,
        },
      });

      const dataImg = await this.employeeRepository.findById(idOfUser);
      if (oldUser.avatar.url) {
        deleteRemoteFile(oldUser.avatar.filename);
        return {code: 200, data: dataImg};
      }
      return {code: 200, data: dataImg};
    }
  }

  @authenticate('jwt')
  @post('/uploadCoverImage/user')
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

    const oldUser: any = await this.userRepository.findById(idOfUser);

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

      if (oldUser.coverImage.url) {
        deleteRemoteFile(oldUser.coverImage.filename);
      }

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
  @post('/uploadCoverImage/shop')
  @response(200, {
    description: 'RequestCreateShop model instance',
    content: {
      'application/json': {schema: getModelSchemaRef(User)},
    },
  })
  async uploadCoverImgShop(
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
    const idOfShop = currentUserProfile.idOfShop;
    const role = currentUserProfile.role;

    const oldUser: any = await this.storeRepository.findById(idOfShop);

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

      if (oldUser.coverImage.url) {
        deleteRemoteFile(oldUser.coverImage.filename);
      }

      await this.storeRepository.updateById(idOfShop, {
        coverImage: {
          filename: dataCoverImage.filename,
          url: dataCoverImage.url,
        },
      });
    }

    return this.storeRepository.findById(idOfShop);
  }


  @authenticate('jwt')
  @post('/uploadCoverImage/kiot')
  @response(200, {
    description: 'RequestCreateShop model instance',
    content: {
      'application/json': {schema: getModelSchemaRef(User)},
    },
  })
  async uploadCoverImgKiot(
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
    const idOfKiot = currentUserProfile.idOfKiot;
    const role = currentUserProfile.role;

    const oldUser: any = await this.kiotRepository.findById(idOfKiot);

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

      if (oldUser.coverImage.url) {
        deleteRemoteFile(oldUser.coverImage.filename);
      }

      await this.kiotRepository.updateById(idOfKiot, {
        coverImage: {
          filename: dataCoverImage.filename,
          url: dataCoverImage.url,
        },
      });
    }

    return this.kiotRepository.findById(idOfKiot);
  }

  @authenticate('jwt')
  @post('/uploadAvatar/shop')
  @response(200, {
    description: 'RequestCreateShop model instance',
    content: {
      'application/json': {schema: getModelSchemaRef(User)},
    },
  })
  async uploadAvatarShop (
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
    const idOfShop = currentUserProfile.idOfShop;
    const role = currentUserProfile.role;

    const oldUser: any = await this.storeRepository.findById(idOfShop);

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
      return response.status(400).send('Chỉ được upload 1 bia');
    }

    if (role == 'customer') {
      console.log('role', role);
      const dataavatar: any = await uploadFile(avatar[0]);

      if (oldUser?.avatar?.url) {
        deleteRemoteFile(oldUser.avatar.filename);
      }

      await this.storeRepository.updateById(idOfShop, {
        avatar: {
          filename: dataavatar.filename,
          url: dataavatar.url,
        },
      });
    }

    return this.storeRepository.findById(idOfShop);
  }

  @authenticate('jwt')
  @post('/uploadAvatar/kiot')
  @response(200, {
    description: 'RequestCreateShop model instance',
    content: {
      'application/json': {schema: getModelSchemaRef(User)},
    },
  })
  async uploadAvatarKiot(
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
    const idOfKiot = currentUserProfile.idOfKiot;
    const role = currentUserProfile.role;

    const oldUser: any = await this.kiotRepository.findById(idOfKiot);

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
      return response.status(400).send('Chỉ được upload 1 bia');
    }

    if (role == 'customer') {
      console.log('role', role);
      const dataavatar: any = await uploadFile(avatar[0]);

      if (oldUser?.avatar?.url) {
        deleteRemoteFile(oldUser.avatar.filename);
      }

      await this.kiotRepository.updateById(idOfKiot, {
        avatar: {
          filename: dataavatar.filename,
          url: dataavatar.url,
        },
      });
    }

    return this.kiotRepository.findById(idOfKiot);
  }

  //
  @post('/register/customer', {
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
          schema: {
            type: 'object',
          },
        },
      },
    })
    newUserRequest: any,
  ): Promise<any> {
    // All new users have the "customer" role by default
    newUserRequest.role = 'customer';
    newUserRequest.status = 'active';
    const time = new Date().toLocaleString();

    try {
      const checked = await this.userRepository.find({
        where: {email: newUserRequest.email},
      });
      if (checked.length > 0) {
        return {
          code: 400,
          message: 'Email đã tồn tại',
        };
      }
      const data = await this.userRepository.create({
        ...newUserRequest,
        createdAt: time,
        updatedAt: time,
      });
      return {
        code: 200,
        data,
      };
    } catch (error) {
      throw error;
    }
  }

  @post('/register/admin', {
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
          schema: {
            type: 'object',
            properties: {
              email: {
                type: 'string',
              },
              password: {
                type: 'string',
              },
              name: {
                type: 'string',
              },
              phoneNumber: {
                type: 'string',
              },
            },
          },
        },
      },
    })
    newUserRequest: any,
  ): Promise<any> {
    const time = new Date().toLocaleString();

    try {
      const list = await this.adminrepository.find({
        where: {email: newUserRequest.email},
      });
      if (list.length > 0) {
        return {
          code: 400,
          message: 'Email đã tồn tại',
        };
      }
      const data = await this.adminrepository.create({
        ...newUserRequest,
        role: 'admin',
        permissions: 'all',
        status: 'active',
        createdBy: 'server',
        createdAt: time,
        updatedAt: time,
      });
      return {
        code: 200,
        data,
      };
    } catch (error) {
      throw error;
    }
  }

  @authenticate('jwt')
  @authorize({
    voters: [basicAuthorization],
    allowedRoles: ['admin'],
  })
  @post('/update/admin', {
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
  async updateAdmin(
    @inject(SecurityBindings.USER)
    currentUser: UserProfile,
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
          },
        },
      },
    })
    newUserRequest: any,
  ): Promise<any> {
    const time = new Date().toLocaleString();
    newUserRequest.updatedAt = time;
    newUserRequest.updatedBy = `admin-${currentUser.id}`;
    try {
      const data = await this.adminrepository.updateById(
        newUserRequest.id,
        newUserRequest,
      );
      return {
        code: 200,
        message: `Update success`,
      };
    } catch (error) {
      throw error;
    }
  }

  @authenticate('jwt')
  @authorize({voters: [basicAuthorization], allowedRoles: ['customer']})
  @post('/update/employee', {
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
  async updateEmployee(
    @inject(SecurityBindings.USER)
    currentUser: UserProfile,
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
          },
        },
      },
    })
    newUserRequest: any,
  ): Promise<any> {
    const time = new Date().toLocaleString();
    newUserRequest.updatedAt = time;
    newUserRequest.updatedBy = `empl-${currentUser.id}`;
    try {
      const data = await this.employeeRepository.updateById(
        newUserRequest.id,
        newUserRequest,
      );
      return {
        code: 200,
        message: `Update success`,
      };
    } catch (error) {
      throw error;
    }
  }

  @authenticate('jwt')
  @authorize({voters: [basicAuthorization], allowedRoles: ['customer']})
  @post('/update/customer', {
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
  async updateCustomer(
    @inject(SecurityBindings.USER)
    currentUser: UserProfile,
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
          },
        },
      },
    })
    newUserRequest: any,
  ): Promise<any> {
    const time = new Date().toLocaleString();
    const {fullName, phoneNumber, gender} = newUserRequest;
    try {
      const data = await this.userRepository.updateById(
        currentUser.id,
        {
          fullName,
          phoneNumber,
          gender,
          updatedAt: time,
          updatedBy: `customer-${currentUser.id}`,
        }
      );
      return {
        code: 200,
        message: `Update success`,
      };
    } catch (error) {
      throw error;
    }
  }

  //
  @authenticate('jwt')
  @authorize({
    voters: [basicAuthorization],
    allowedRoles: ['admin'],
  })
  @post('/banned/customer/{idOfUser}', {
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
  async BanCustomer(
    @param.path.string('idOfUser') idOfUser: string,
    @inject(SecurityBindings.USER)
    currentUser: UserProfile,
  ): Promise<any> {
    const time = new Date().toLocaleString();
    try {
      const data = await this.userRepository.updateById(idOfUser, {
        status: 'banned',
        updatedAt: time,
        updatedBy: `admin-${currentUser.id}`,
      });
      return {
        code: 200,
        message: `Update success`,
      };
    } catch (error) {
      throw error;
    }
  }

  @authenticate('jwt')
  @authorize({
    voters: [basicAuthorization],
    allowedRoles: ['admin', 'users-Managment'],
  })
  @post('/unbanned/customer/{idOfUser}', {
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
  async Unban(
    @param.path.string('idOfUser') idOfUser: string,
    @inject(SecurityBindings.USER)
    currentUser: UserProfile,
  ): Promise<any> {
    const time = new Date().toLocaleString();
    try {
      const data = await this.userRepository.updateById(idOfUser, {
        status: 'active',
        updatedAt: time,
        updatedBy: `admin-${currentUser.id}`,
      });
      return {
        code: 200,
        message: `Update success`,
      };
    } catch (error) {
      throw error;
    }
  }

  @post('/login/Customer', {
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

  @post('/login/Employee', {
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
  async loginEmployee(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              username: {
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
    credentials: CredentialsForEmployee,
  ): Promise<{token: string}> {
    // ensure the user exists, and the password is correct
    const user = await this.employeeService.verifyCredentials(credentials);

    // convert a User object into a UserProfile object (reduced set of properties)
    const userProfile = this.employeeService.convertToUserProfile(user);

    // create a JSON Web Token based on the user profile
    const token = await this.jwtService.generateToken(userProfile);

    return {token};
  }

  @post('/login/Admin', {
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

  @post('/forgotPassword/Customer', {
    responses: {
      '200': {
        description: 'send mail to reset password',
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
      },
    },
  })
  async forgotPassword(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              email: {
                type: 'string',
              },
            },
          },
        },
      },
    })
    req: any,
  ): Promise<any> {
    const {email} = req;

    const user = await this.userRepository.findOne({where: {email}});

    if (!user) {
      return {
        code: 400,
        message: 'Email không tồn tại',
      };
    }

    const userInfor = {
      id: user.id,
      email: user.email,
    };

    const resetToken = await signAsync(userInfor, 'hello', {
      expiresIn: 60 * 1000 * 2,
    });

    this.userRepository.updateById(user.id, {resetToken});

    const data = await sendEmail(
      email,
      'Reset Password',
      `http://localhost:3000/resetPassword?token=${resetToken}`,
    );

    return {
      code: 200,
      message: 'Email sent',
    };
  }

  @post('/forgotPassword/Admin', {
    responses: {
      '200': {
        description: 'send mail to reset password',
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
      },
    },
  })
  async forgotPasswordAdmin(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              email: {
                type: 'string',
              },
            },
          },
        },
      },
    })
    req: any,
  ): Promise<any> {
    const {email} = req;

    const user = await this.adminrepository.findOne({where: {email}});

    if (!user) {
      return {
        code: 400,
        message: 'Email không tồn tại',
      };
    }

    const userInfor = {
      id: user.id,
      email: user.email,
    };

    const resetToken = await signAsync(userInfor, 'hello', {
      expiresIn: 60 * 1000 * 2,
    });

    this.adminrepository.updateById(user.id, {resetToken});

    const data = await sendEmail(
      email,
      'Reset Password',
      `http://localhost:3000/resetPassword?token=${resetToken}`,
    );

    return {
      code: 200,
      message: 'Email sent',
    };
  }

  @post('/forgotPassword/Employee', {
    responses: {
      '200': {
        description: 'send mail to reset password',
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
      },
    },
  })
  async forgotPasswordEployee(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              email: {
                type: 'string',
              },
            },
          },
        },
      },
    })
    req: any,
  ): Promise<any> {
    const {email} = req;

    const user = await this.employeeRepository.findOne({where: {email}});

    if (!user) {
      return {
        code: 400,
        message: 'Email không tồn tại',
      };
    }

    const userInfor = {
      id: user.id,
      email: user.email,
    };

    const resetToken = await signAsync(userInfor, 'hello', {
      expiresIn: 60 * 1000 * 2,
    });

    this.employeeRepository.updateById(user.id, {resetToken});

    const data = await sendEmail(
      email,
      'Reset Password',
      `http://localhost:3000/forgotPassowrdEmployee?token=${resetToken}`,
    );
    
    return {
      code: 200,
      message: 'Email sent',
    };
  }

  @post('/resetPassword/Customer', {
    responses: {
      '200': {
        description: 'Change Password',
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
      },
    },
  })
  async resetPassword(
    @requestBody({
      description: 'Change Password',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              token: {
                type: 'string',
              },
              newPassword: {
                type: 'string',
              },
            },
          },
        },
      },
    })
    {token, newPassword}: {token: string; newPassword: string},
  ): Promise<any> {
    let decoded;

    try {
      decoded = await verifyAsync(token, 'hello');
      console.log(decoded);
      if (!decoded.id)
        return {
          code: 400,
          message: 'Invalid or expired token',
        };
    } catch (error) {
      throw new Error('Invalid or expired token');
    }

    const user = await this.userRepository.findById(decoded.id);

    if (!user || user.resetToken !== token) {
      return {
        code: 400,
        message: 'Invalid or expired token',
      };
    }

    user.password = newPassword;
    user.resetToken = generateRandomString(10);

    await this.userRepository.updateById(user.id, user);

    return {code: 200, message: 'Password has been changed'};
  }

  @post('/resetPassword/Admin', {
    responses: {
      '200': {
        description: 'Change Password',
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
      },
    },
  })
  async resetPasswordAdmin(
    @requestBody({
      description: 'Change Password',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              token: {
                type: 'string',
              },
              newPassword: {
                type: 'string',
              },
            },
          },
        },
      },
    })
    {token, newPassword}: {token: string; newPassword: string},
  ): Promise<any> {
    let decoded;

    try {
      decoded = await verifyAsync(token, 'hello');
      console.log(decoded);
      if (!decoded.id)
        return {
          code: 400,
          message: 'Invalid or expired token',
        };
    } catch (error) {
      throw new Error('Invalid or expired token');
    }

    const user = await this.adminrepository.findById(decoded.id);

    if (!user || user.resetToken !== token) {
      return {
        code: 400,
        message: 'Invalid or expired token',
      };
    }

    user.password = newPassword;
    user.resetToken = generateRandomString(10);

    await this.adminrepository.updateById(user.id, user);

    return {code: 200, message: 'Password has been changed'};
  }

  @post('/resetPassword/Employee', {
    responses: {
      '200': {
        description: 'Change Password',
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
      },
    },
  })
  async resetPasswordEmployee(
    @requestBody({
      description: 'Change Password',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              token: {
                type: 'string',
              },
              newPassword: {
                type: 'string',
              },
            },
          },
        },
      },
    })
    {token, newPassword}: {token: string; newPassword: string},
  ): Promise<any> {
    let decoded;

    try {
      decoded = await verifyAsync(token, 'hello');
      console.log(decoded);
      if (!decoded.id)
        return {
          code: 400,
          message: 'Invalid or expired token',
        };
    } catch (error) {
      throw new Error('Invalid or expired token');
    }

    const user = await this.employeeRepository.findById(decoded.id);

    if (!user || user.resetToken !== token) {
      return {
        code: 400,
        message: 'Invalid or expired token',
      };
    }

    user.password = newPassword;
    user.resetToken = generateRandomString(10);

    await this.employeeRepository.updateById(user.id, user);

    return {code: 200, message: 'Password has been changed'};
  }

  @authenticate('jwt')
  @post('/changePassword/customer', {
    responses: {
      '200': {
        description: 'Change Password',
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
      },
    },
  })
  async changePassword(
    @inject(SecurityBindings.USER)
    currenUserProfile: UserProfile,
    @requestBody({
      description: 'Change Password',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              oldPassword: {
                type: 'string',
              },
              newPassword: {
                type: 'string',
              },
            },
          },
        },
      },
    })
    req: {
      oldPassword: string;
      newPassword: string;
    },
  ): Promise<any> {
    const {oldPassword, newPassword} = req;
    const id = currenUserProfile.id;
    const user = await this.userRepository.findById(id);

    if (!user) {
      return {
        code: 400,
        message: 'User not found',
      };
    }

    const isPasswordMatch = user.password === oldPassword;

    if (!isPasswordMatch) {
      return {
        code: 400,
        message: 'Old password is incorrect',
      };
    }

    user.password = newPassword;

    await this.userRepository.updateById(user.id, user);

    return {code: 200, message: 'Password has been changed'};
  }

  @authenticate('jwt')
  @post('/changePassword/Admin', {
    responses: {
      '200': {
        description: 'Change Password',
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
      },
    },
  })
  async changePasswordAdmin(
    @inject(SecurityBindings.USER)
    currenUserProfile: UserProfile,
    @requestBody({
      description: 'Change Password',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              oldPassword: {
                type: 'string',
              },
              newPassword: {
                type: 'string',
              },
            },
          },
        },
      },
    })
    req: {
      oldPassword: string;
      newPassword: string;
    },
  ): Promise<any> {
    const {oldPassword, newPassword} = req;
    const id = currenUserProfile.id;
    const user = await this.adminrepository.findById(id);

    if (!user) {
      return {
        code: 400,
        message: 'User not found',
      };
    }

    const isPasswordMatch = user.password === oldPassword;

    if (!isPasswordMatch) {
      return {
        code: 400,
        message: 'Old password is incorrect',
      };
    }

    user.password = newPassword;

    await this.adminrepository.updateById(user.id, user);

    return {code: 200, message: 'Password has been changed'};
  }

  @authenticate('jwt')
  @post('/changePassword/employee', {
    responses: {
      '200': {
        description: 'Change Password',
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
      },
    },
  })
  async changePasswordEmployee(
    @inject(SecurityBindings.USER)
    currenUserProfile: UserProfile,
    @requestBody({
      description: 'Change Password',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              oldPassword: {
                type: 'string',
              },
              newPassword: {
                type: 'string',
              },
            },
          },
        },
      },
    })
    req: {
      oldPassword: string;
      newPassword: string;
    },
  ): Promise<any> {
    const {oldPassword, newPassword} = req;
    const id = currenUserProfile.id;
    const user = await this.employeeRepository.findById(id);

    if (!user) {
      return {
        code: 400,
        message: 'User not found',
      };
    }

    const isPasswordMatch = user.password === oldPassword;

    if (!isPasswordMatch) {
      return {
        code: 400,
        message: 'Old password is incorrect',
      };
    }

    user.password = newPassword;

    await this.employeeRepository.updateById(user.id, user);

    return {code: 200, message: 'Password has been changed'};
  }

  @authenticate('jwt')
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
      const data: any = this.adminrepository.findById(
        currentUserProfile[securityId],
      );

      return data;
    } else if (currentUserProfile.role == 'customer') {
      const data = await this.userRepository.findById(
        currentUserProfile[securityId],
      );

      return data;
    } else {
      const data: any = await this.employeeRepository.findById(
        currentUserProfile[securityId],
      );

      return data;
    }
  }

  @authenticate('jwt')
  @get('myShop', {
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
  async myShop(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<any> {
    const data: any = await this.storeRepository.findById(currentUserProfile.idOfShop);
    return data;
  }

  @authenticate('jwt')
  @get('myKiot', {
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
  async myKiot(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<any> {
    const data: any = await this.kiotRepository.findById(currentUserProfile.idOfKiot);
    return data;
  }


  @get('getAllUser', {
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
  async getAllUser(
    @param.query.object('filter') filter?: Filter<User>,
  ): Promise<any> {
    const data = await this.userRepository.find(filter);

    this.response.header('Access-Control-Expose-Headers', 'Content-Range');

    this.response.header('Content-Range', 'Users 0-20/20');
    this.response.status(200).send(data);
  }

  @authenticate('jwt')
  @get('getAllUser/count', {
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
  async getAllUserCount(
    @param.query.object('filter') filter?: Filter<User>,
  ): Promise<any> {
    return this.userRepository.count(filter);
  }
}
