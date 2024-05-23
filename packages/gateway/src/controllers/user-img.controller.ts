// Uncomment these imports to begin using these cool features!

import {inject} from '@loopback/core';
import {
  post,
  requestBody,
  get,
  RestBindings,
  Response,
  Request,
  response,
} from '@loopback/rest';
import {authenticate} from '@loopback/authentication';
import axios from '../services/authAxios.service';
import multer from 'multer';
import FormData from 'form-data';

const storage = multer.memoryStorage();
const upload = multer({storage});

var cpUpload = upload.fields([{name: 'avatar'}, {name: 'coverImage'}]);
// import {inject} from '@loopback/core';

export class UserImgController {
  constructor(
    @inject(RestBindings.Http.RESPONSE) public response: Response,
    @inject(RestBindings.Http.REQUEST) public request: Request,
  ) {}

  @authenticate('jwt')
  @post('/uploadAvatar/user', {
    responses: {
      '200': {
        description: 'Return avatar user',
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
  async uploadAvt(
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

    if (!avatar) return {code: 400, message: 'No file found'};

    if (avatar.length > 1)
      return {
        code: 400,
        message: 'Only one file is allowed',
      };

    let formData = new FormData();

    formData.append('avatar', avatar[0].buffer, avatar[0].originalname);

    const uploadAvtData = await axios
      .post(`/uploadAvatar/user`, formData, {
        headers: {
          authorization: `${this.request.headers.authorization}`,
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(data => data)
      .catch(e => console.log(e));

    return uploadAvtData;
  }

  @authenticate('jwt')
  @post('/uploadAvatar/shop', {
    responses: {
      '200': {
        description: 'Return avatar user',
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
  async uploadAvtShop(
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

    if (!avatar) return {code: 400, message: 'No file found'};

    if (avatar.length > 1)
      return {
        code: 400,
        message: 'Only one file is allowed',
      };

    let formData = new FormData();

    formData.append('avatar', avatar[0].buffer, avatar[0].originalname);

    const uploadAvtData = await axios
      .post(`/uploadAvatar/shop`, formData, {
        headers: {
          authorization: `${this.request.headers.authorization}`,
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(data => data)
      .catch(e => console.log(e));

    return uploadAvtData;
  }


  @authenticate('jwt')
  @post('/uploadAvatar/kiot', {
    responses: {
      '200': {
        description: 'Return avatar user',
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
  async uploadAvtKiot(
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

    if (!avatar) return {code: 400, message: 'No file found'};

    if (avatar.length > 1)
      return {
        code: 400,
        message: 'Only one file is allowed',
      };

    let formData = new FormData();

    formData.append('avatar', avatar[0].buffer, avatar[0].originalname);

    const uploadAvtData = await axios
      .post(`/uploadAvatar/kiot`, formData, {
        headers: {
          authorization: `${this.request.headers.authorization}`,
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(data => data)
      .catch(e => console.log(e));

    return uploadAvtData;
  }




  @authenticate('jwt')
  @post('/uploadCoverImage/user', {
    responses: {
      '200': {
        description: 'Return avatar user',
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
  async uploadCoverImg(
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

    if (!coverImage) return {code: 400, message: 'No file found'};

    if (coverImage.length > 1)
      return {
        code: 400,
        message: 'Only one file is allowed',
      };

    let formData = new FormData();

    formData.append(
      'coverImage',
      coverImage[0].buffer,
      coverImage[0].originalname,
    );

    const uploadCoverImgData = await axios
      .post(`/uploadCoverImage/user`, formData, {
        headers: {
          authorization: `${this.request.headers.authorization}`,
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(data => data)
      .catch(e => console.log(e));

    return uploadCoverImgData;
  }

  @authenticate('jwt')
  @post('/uploadCoverImage/shop', {
    responses: {
      '200': {
        description: 'Return avatar user',
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
  async uploadCoverImgshop(
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

    if (!coverImage) return {code: 400, message: 'No file found'};

    if (coverImage.length > 1)
      return {
        code: 400,
        message: 'Only one file is allowed',
      };

    let formData = new FormData();

    formData.append(
      'coverImage',
      coverImage[0].buffer,
      coverImage[0].originalname,
    );

    const uploadCoverImgData = await axios
      .post(`/uploadCoverImage/shop`, formData, {
        headers: {
          authorization: `${this.request.headers.authorization}`,
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(data => data)
      .catch(e => console.log(e));

    return uploadCoverImgData;
  }

  @authenticate('jwt')
  @post('/uploadCoverImage/kiot', {
    responses: {
      '200': {
        description: 'Return avatar user',
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
  async uploadCoverImgKiot(
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

    if (!coverImage) return {code: 400, message: 'No file found'};

    if (coverImage.length > 1)
      return {
        code: 400,
        message: 'Only one file is allowed',
      };

    let formData = new FormData();

    formData.append(
      'coverImage',
      coverImage[0].buffer,
      coverImage[0].originalname,
    );

    const uploadCoverImgData = await axios
      .post(`/uploadCoverImage/kiot`, formData, {
        headers: {
          authorization: `${this.request.headers.authorization}`,
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(data => data)
      .catch(e => console.log(e));

    return uploadCoverImgData;
  }
}
