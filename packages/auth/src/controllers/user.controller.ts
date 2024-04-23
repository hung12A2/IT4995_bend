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
import {property, repository} from '@loopback/repository';
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
import {AdminRepository, EmployeeRepository} from '../repositories';
import {AdminManagmentService} from '../services/adminManagement.service';
import multer from 'multer';
import {deleteRemoteFile, uploadFile} from '../config/firebaseConfig';
import nodemailer from 'nodemailer';
import {promisify} from 'util';

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
    const time = new Date().toISOString();

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
          },
        },
      },
    })
    newUserRequest: any,
  ): Promise<any> {
    const time = new Date().toISOString();

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

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'hung1311197820022@gmail.com',
        pass: 'mvza fmtv fbsc gsig',
      },
    });

    const mailOptions = {
      from: 'hung1311197820022@gmail.com',
      to: email,
      subject: 'Sending Email using Node.js',
      text: 'Token: ' + resetToken,
    };

    const data = await transporter.sendMail(mailOptions);
    return {
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
        return this.response.status(400).send({message: 'Invalid token'});
    } catch (error) {
      throw new Error('Invalid or expired token');
    }

    const user = await this.userRepository.findById(decoded.id);

    if (!user || user.resetToken !== token) {
      throw new Error('Invalid or expired token');
    }

    user.password = newPassword;
    user.resetToken = null;

    await this.userRepository.updateById(user.id, user);

    return {message: 'Password has been changed'};
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
      return this.response.status(400).send({message: 'User not found'});
    }

    const isPasswordMatch = user.password === oldPassword;

    if (!isPasswordMatch) {
      return this.response
        .status(400)
        .send({message: 'Old password is incorrect'});
    }

    user.password = newPassword;

    await this.userRepository.updateById(user.id, user);

    return {message: 'Password has been changed'};
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
      const data: any = this.adminrepository.findById(
        currentUserProfile[securityId],
      );
      delete data.password;

      return data;
    } else if (currentUserProfile.role == 'customer') {
      const data = await this.userRepository.findById(
        currentUserProfile[securityId],
      );
      delete data.password;

      return data;
    } else {
      const data: any = await this.employeeRepository.findById(
        currentUserProfile[securityId],
      );

      delete data.password;

      return data;
    }
  }

  @post('getInfoByPass/customer', {
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
  async getUserByPassword(
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
    req: any,
  ): Promise<any> {
    const {email, password} = req;
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

    return {
      code:200,
      data: foundUser
    };
  }

  @post('getInfoByPass/admin', {
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
  async getAdminByPassword(
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
    req: any,
  ): Promise<any> {
    const {email, password} = req;
    const invalidCredentialsError = 'Invalid email or password.';

    if (!email) {
      throw new HttpErrors.Unauthorized(invalidCredentialsError);
    }
    const foundUser = await this.adminrepository.findOne({
      where: {email},
    });

    if (foundUser?.password !== password)
      throw new HttpErrors.Unauthorized(invalidCredentialsError);

    if (!foundUser) {
      throw new HttpErrors.Unauthorized(invalidCredentialsError);
    }

    return foundUser;
  }

  @post('getInfoByPass/employee', {
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
  async getEmployeeByPassword(
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
    req: any,
  ): Promise<any> {
    const {email, password} = req;
    const invalidCredentialsError = 'Invalid email or password.';

    if (!email) {
      throw new HttpErrors.Unauthorized(invalidCredentialsError);
    }
    const foundUser = await this.employeeRepository.findOne({
      where: {email},
    });

    if (foundUser?.password !== password)
      throw new HttpErrors.Unauthorized(invalidCredentialsError);

    if (!foundUser) {
      throw new HttpErrors.Unauthorized(invalidCredentialsError);
    }

    return foundUser;
  }
}
